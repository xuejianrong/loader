Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    msg: 'loader msg',
    demoList: [{ id: 0, desc: 'demo1' }, { id: 1, desc: 'demo2' }],
    // 以下的才会用到
    loadScript: (params) => {
      // 接收src、callback
      const js = document.createElement('script');
      js.setAttribute('src', params.src);
      const head = document.getElementsByTagName('head')[0] || document.documentElement;
      head.appendChild(js);

      js.onload = params.callback;
    },
    isString(str) {
      return typeof str === 'string' || str.constructor === String;
    },
    isArray(arr) {
      return arr &&
        typeof arr === 'object' &&
        typeof arr.length === 'number' &&
        typeof arr.splice === 'function' &&
        !({}.propertyIsEnumerable.call(arr, 'length'));
    },
    // 微信分享参数
    wxShare: {
      title: '',
      img: '',
      desc: '',
      url: '',
    },
  },
  getters: {
    // 返回state的计算属性
    getterMsg: state => `${state.msg} in getter`,
    // 返回一个方法，可带参数的计算或者过滤state中的值
    getDemoDesc: state => id => state.demoList.find(demo => demo.id === id),
    // 一下的才会用到
  },
  mutations: {
    // 设置state
    setState(state, params) {
      Vue.set(state, params.key, params.val);
    },
    bindShare(state) {
      wx.onMenuShareTimeline({
        title: state.wxShare.title, // 分享标题
        link: state.wxShare.url, // 分享链接
        imgUrl: state.wxShare.img, // 分享图标
        success: () => {
          // 用户确认分享后执行的回调函数
        },
        cancel: () => {
          // 用户取消分享后执行的回调函数
        },
      });
      wx.onMenuShareAppMessage({
        title: state.wxShare.title, // 分享标题
        desc: state.wxShare.desc, // 分享描述
        link: state.wxShare.url, // 分享链接
        imgUrl: state.wxShare.img, // 分享图标
        type: 'link', // 分享类型,music、video或link，不填默认为link
        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
        success: () => {
          // 用户确认分享后执行的回调函数
        },
        cancel: () => {
          // 用户取消分享后执行的回调函数
        },
      });
    },
    accord(state, desc) {
      // desc: String or Array
      let eventCategory = 'eventCategory';
      let eventAction = 'eventAction';
      let eventLabel = 'eventLabel';

      if (state.isString(desc)) {
        eventCategory = desc;
        eventAction = desc;
        eventLabel = desc;
      } else if (state.isArray(desc)) {
        if (desc[0]) eventCategory = desc[0];
        if (desc[1]) eventAction = desc[1];
        if (desc[2]) eventLabel = desc[2];
      }
      if (typeof _hmt !== 'undefined') {
        _hmt.push(['_trackEvent', `${state.appName}-${eventCategory}`, `${state.appName}-${eventAction}`, `${state.appName}-${eventLabel}`]);
      }
      if (typeof ga !== 'undefined') {
        ga('send', 'event', `${state.appName}-${eventCategory}`, `${state.appName}-${eventAction}`, `${state.appName}-${eventLabel}`);
      }
    },
  },
  actions: {
    wxInit({ dispatch }, callback, bindShow = true) {
      dispatch('loadScript', {
        src: '//res.wx.qq.com/open/js/jweixin-1.0.0.js',
        callback: () => {
          dispatch('loadScript', {
            src: '//api.h5.zb.nagezan.net/cgi-bin/get_jsapi_sign',
            callback: () => {
              /* global wx_cfg:true */
              wx.config({
                debug: false,
                appId: wx_cfg.appId, // 必填，公众号的唯一标识
                timestamp: wx_cfg.timestamp, // 必填，生成签名的时间戳
                nonceStr: wx_cfg.nonceStr, // 必填，生成签名的随机串
                signature: wx_cfg.signature, // 必填，签名，见附录1
                jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage'], // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
              });

              if (bindShow) {
                wx.ready(() => {
                  dispatch('bindShare');
                  if (typeof callback === 'function') {
                    callback();
                  }
                });
              }
              wx.error((res1) => {
                console.log(JSON.stringify(res1, null, 4));
              });
            },
          });
        },
      });
    },
  }
});
