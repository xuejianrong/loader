;(function (global) {
  'use strict';

  //检查文件类型
  var TYPE_RE = /\.(js|css)(?=[?&,]|$)/i;
  function fileType(str) {
    var ext = 'js';
    str.replace(TYPE_RE, function (m, $1) {
      ext = $1;
    });
    if (ext !== 'js' && ext !== 'css') ext = 'unknown';
    return ext;
  }

  //将js片段插入dom结构
  function evalGlobal(strScript, url){
    if (url.indexOf('lib') >= 0 || url.indexOf('other') >= 0) {
      // 常用文件
      if (!(strScript.indexOf('ForLoader') >= 0)) {
        localStorage.removeItem(url);
        console.error(url + ': 常用文件不包含ForLoader，有可能已经被挟持，loader将不缓存此文件');
      }
    } else {
      if (strScript.indexOf('Vue') < 0) {
        localStorage.removeItem(url);
        console.error(url + ': 业务不包含Vue，有可能已经被挟持，loader将不缓存此文件');
      }
    }
    var scriptEl = document.createElement ("script");
    scriptEl.type= "text/javascript";
    scriptEl.text= strScript;
    document.getElementsByTagName("head")[0].appendChild(scriptEl) ;
  }

  //将css片段插入dom结构
  function createCss(strCss) {
    var styleEl = document.createElement('style');
    document.head.appendChild(styleEl);
    styleEl.appendChild(document.createTextNode(strCss));
  }

  // 在全局作用域执行js或插入style node
  function defineCode(url, str) {
    var type = fileType(url);
    if (type === "js"){
      //with(window)eval(str);
      evalGlobal(str, url);
    }else if(type === "css"){
      createCss(str);
    }
  }

  // 将数据写入localstorage,不行则清除
  var setLocalStorage = function(key, item){
    if (window.localStorage) {
      try{
        window.localStorage.setItem(key, item);
      }catch(e){
        // 内存超了之后需要清除掉缓存
        clearStorage();
      }
    }
  };

  // 从localstorage中读取数据
  var getLocalStorage = function(key){
    return window.localStorage && window.localStorage.getItem(key);
  }

  // 通过AJAX请求读取js和css文件内容，使用队列控制js的执行顺序
  var rawQ = [];
  var loader = function(option) {
    this.name = '';
    this.setName = function (name) {
      this.name = name;
    };
    this.version = '';
    this.setVersion = function (ver) {
      this.version = ver;

      // 检查版本
      if (localStorage && localStorage.getItem(this.name + 'Version') !== this.version) {
        // 清除旧版本缓存
        clearStorage(this.name);
        setLocalStorage(this.name + 'Version', this.version);
      }
    };
    this.load = function(url,onload,bOrder){
      var iQ = rawQ.length;
      var _this = this;
      if(bOrder){
        var qScript = {key: null, response: null, onload: onload, done: false};
        rawQ[iQ] = qScript;
      }
      //有localstorage 缓存
      var ls = getLocalStorage(url);
      if(ls !== null){
        if(bOrder){
          rawQ[iQ].response = ls;
          rawQ[iQ].key = url;
          this.injectScripts();
        }else{
          defineCode(url, ls)
          if(onload){
            onload();
          }
        }
      } else {
        var xhrObj = this.getXHROject();
        xhrObj.open('GET', url, true);
        xhrObj.send(null);
        xhrObj.onreadystatechange = function(){
          if(xhrObj.readyState == 4){
            if(xhrObj.status == 200){
              setLocalStorage(url, xhrObj.responseText);
              if(bOrder){
                rawQ[iQ].response = xhrObj.responseText;
                rawQ[iQ].key = url;
                _this.injectScripts();
              }else{
                defineCode(url, xhrObj.responseText)
                if(onload){
                  onload();
                }
              }
            }
          }
        }
      }
    };
    this.injectScripts = function(){
      var len = rawQ.length;
      //按顺序执行队列中的脚本
      for (var i = 0; i < len; i++) {
        var qScript = rawQ[i];
        //没有执行
        if(!qScript.done){
          //没有加载完成
          if(!qScript.response){
            // console.error("raw code lost or not load!");
            //停止，等待加载完成, 由于脚本是按顺序添加到队列的，因此这里保证了脚本的执行顺序
            break;
          }else{//已经加载完成了
            defineCode(qScript.key, qScript.response)
            if(qScript.onload){
              qScript.onload();
            }
            delete qScript.response;
            qScript.done = true;
          }
        }
      }
    };
    this.getXHROject = function(){
      //创建XMLHttpRequest对象
      var xmlhttp;
      if (window.XMLHttpRequest)
      {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp=new XMLHttpRequest();
      } else {
        // code for IE6, IE5
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
      }
      return xmlhttp;
    };
    if (!option.name) {
      console.error('请正确设置name');
      return
    }
    if (!option.version) {
      console.error('请正确设置version');
      return
    }
    this.setName(option.name);
    this.setVersion(option.version);
  };

  function clearStorage(name) {
    if (name) {
      // 清除旧版本缓存
      for (var key in localStorage) {
        if (key.indexOf(name) > -1) {
          localStorage.removeItem(key);
        }
      }
    } else {
      // 清除所有缓存
      window.localStorage.clear();
      setLocalStorage(name + 'Version', loader.version);
    }
  };

  global.lsLoader = loader;
})(this);

