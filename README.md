# loader

> 基于vue-cli脚手架的webpack-template，发布后能利用localStorage缓存文件。初始化之后无需再做其他配置

## Documentation

- [For this template](https://github.com/xuejianrong/loader): common questions specific to this template are answered and each part is described in greater detail
- [For Vue 2.0](http://vuejs.org/guide/): general information about how to work with Vue, not specific to this template

## 使用

``` bash
$ npm install -g vue-cli
$ vue init xuejianrong/loader my-project
$ cd my-project
$ npm install
$ npm run dev
```

## build
``` bash
$ npm run build
```

**每一次build之前需要在package.json中修改version，否则无法更新修改。是否更新缓存的依据就是这个版本号**
