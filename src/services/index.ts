// index.ts
import axios from "axios";
import { ElLoading } from 'element-plus'
import { hideLoading, showLoading } from "../utils/loading";
let defaultLoadingOption = {
  text: '加载中',
  background: 'rgba(0,0,0,.2)',
  lock: true
}
const loadingInstance = () => ElLoading.service(defaultLoadingOption)
/* 实例化请求配置 */
const instance = axios.create({
  headers: {
    //php 的 post 传输请求头一定要这个 不然报错 接收不到值
    "Content-Type": "application/json;charset=UTF-8",
    "Access-Control-Allow-Origin-Type": '*'
  },
  // 请求时长
  timeout: 1000 * 30,
  // 请求的base地址 TODO:这块以后根据不同的模块调不同的api
  baseURL: 'https://myshare.cc',
  //     ? "测试"
  //     : "正式",
  // 表示跨域请求时是否需要使用凭证
  withCredentials: false,
})

/** 
 * 请求拦截器 
 * 每次请求前，如果存在token则在请求头中携带token 
 */
instance.interceptors.request.use(
  config => {
    showLoading()
    return config;
  },
  error => {
    hideLoading()
    return Promise.reject(error.data.error.message);
  }

)

// 响应拦截器
instance.interceptors.response.use(function (config) {
  hideLoading()
  // 请求成功
  if (config.status === 200 || config.status === 204) {
    return Promise.resolve(config.data);
  } else {
    return Promise.reject(config);
  }
  // 请求失败
}, function (error) {}
)
// 只需要考虑单一职责，这块只封装axios
export default instance
