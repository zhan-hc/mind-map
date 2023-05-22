import { ElLoading, LoadingOptions } from 'element-plus'
// 初始化loading
let loadingInstance: any;
let defaultOption =  {
  lock: true,
  text: 'Loading',
  background: 'rgba(0, 0, 0, 0.7)'
}


const showLoading = (option?: LoadingOptions) => {
  console.log(option || defaultOption)
  loadingInstance = ElLoading.service({ ...defaultOption, ...option });
};


const hideLoading = () => {
  loadingInstance.close();
};
export { showLoading, hideLoading };