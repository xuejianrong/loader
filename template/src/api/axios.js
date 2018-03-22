// import axios from 'axios'

const istest = true;
const api = {
  baseURL: istest ? '' : ''
};

/* 1.用正则表达式实现html转码 */
function htmlEncodeByRegExp(str) {
  let s = '';
  if (str.length === 0) return '';
  s = str.replace(/&/g, '&amp;');
  s = s.replace(/</g, '&lt;');
  s = s.replace(/>/g, '&gt;');
//        s = s.replace(/ /g, '&nbsp;');
//        s = s.replace(/\'/g, '&#39;');
//        s = s.replace(/\'/g, '&quot;');
  return s;
}
// axios 全局配置
axios.defaults.timeout = 5000;
axios.defaults.baseURL = api.baseURL;

// http request 拦截器
axios.interceptors.request.use(
  config => {
    return config;
  },
  err => {
    console.log(`axios request err: ${JSON.stringify(err)}`);
    // return Promise.reject(err);
  }
);

// http response 拦截器
axios.interceptors.response.use(
  response => {
    response.data = JSON.parse(htmlEncodeByRegExp(JSON.stringify(response.data)));
    return response;
  },
  err => {
    console.log(`axios response err: ${JSON.stringify(err)}`);
  }
);

// 创建axios实例
const service = axios.create({
  baseURL: api.baseURL, // api的base_url
  timeout: 5000 // 请求超时时间
});

// request拦截器
service.interceptors.request.use(config => {
  return config;
}, err => {
  console.log(`axios service request err: ${JSON.stringify(err)}`);
});

// respone拦截器
service.interceptors.response.use(response => {
  response.data = JSON.parse(htmlEncodeByRegExp(JSON.stringify(response.data)));
  return response;
}, err => {
  console.log(`axios service response err: ${JSON.stringify(err)}`);
});

function getAxiosPromiseObject(apiObj) {
  const obj = {};
  Object.entries(apiObj).forEach((val) => {
    if (typeof val[1] === 'object' && !Array.isArray(val[1])) {
      Object.entries(val[1]).forEach((valChild) => {
        if (valChild[0] && valChild[1]) {
          obj[valChild[0]] = (data) => {
            return service[val[0]](valChild[1], data);
          };
        }
      });
    }
  });
  return obj;
}

export {
  getAxiosPromiseObject,
  istest,
  service,
  axios
};
