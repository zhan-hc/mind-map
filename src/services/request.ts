// request.ts
import axios from "./index";

export class Request {
  /**
   * get方法
   * @param {string} url 路径
   * @param {object} params 参数
   */
  static get = (url: string, params?: any) => {
    return new Promise((resolve, reject) => {
      axios.get(url, { params: params }).then(res => {
        resolve(res);
      }).catch(err => {
        reject(err);
      })
    })
  }

  static post = (url: string, data: any, config: any) => {
    return new Promise((resolve, reject) => {
      axios.post(url, data, config).then(res => {
        resolve(res);
      }).catch(err => {
        reject(err);
      })
    })
  }
}
