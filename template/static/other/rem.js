/* eslint-disable */
(function () {
  function init(){
    var docEl = document.documentElement;

    window.addEventListener('resize', function () {
      refreshRem(docEl);
    });

    refreshRem(docEl);
  }
  function refreshRem(docEl){
    var innerWidth = window.innerWidth
    var clientWidth = document.documentElement.clientWidth
    var getWidth = docEl.getBoundingClientRect().width
    var width = innerWidth ? innerWidth : 750

    if (width > innerWidth && innerWidth > 0) {
      width = innerWidth
    }

    if (width > clientWidth && clientWidth > 0) {
      width = clientWidth
    }

    if (width > getWidth && getWidth > 0) {
      width = getWidth
    }

    if (width > 750) {
      // 最大宽度
      width = 750;
    }
    var rem = width / 20; // 将屏幕宽度分成20份， 1份为1rem
    docEl.style.fontSize = rem + 'px';
  }
  init();
})()
