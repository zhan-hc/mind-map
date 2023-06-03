import { IMG_SIZE } from "../../constant";
import { ImageData } from "../node/node";

class AddImage {
  private _filePath: string;
  public constructor () {
    this._filePath = ''
  }
  public get filePath () {
    return this._filePath
  }
  public chooseImage () :Promise<ImageData> {
    const that = this
    return new Promise((resolve, reject) => {
      let input = document.createElement("input");
      input.setAttribute("type", "file");
      input.accept = "image/*";
      input.addEventListener("change", (e: any) => {
        let file = e.target.files[0];
        // 浏览器兼容性处理（有的浏览器仅存在 Window.URL）
        const windowURL = window.URL || window.webkitURL;
        that._filePath = windowURL.createObjectURL(file);
        const img = new Image();
        img.src = that._filePath
        img.onload = function () {
          resolve({
            url: that._filePath,
            ...that.scaleImage(img),
            file
          })
        }
      });
      input.click();
    })
    
  }
  // 等比例缩放图片
  public scaleImage (image: HTMLImageElement): {width: number, height: number} {
    const fitWidth = IMG_SIZE.width
    const fitHeight = IMG_SIZE.height
    let newWidth = image.width
    let newHeight = image.height
    if (image.width > 0 && image.height > 0){
      if(image.width / image.height >=  fitWidth / fitHeight) {
        if (image.width > fitWidth) {
          newWidth = fitWidth;
          newHeight = (image.height * fitWidth) / image.width;
        } else {
          newWidth= image.width; 
          newHeight = image.height;
        }
      } else {
        if (image.height > fitHeight) {
          newHeight = fitHeight;
          newWidth = (image.width * fitHeight) / image.height;
        } else {
          newWidth = image.width; 
          newHeight = image.height;
        } 
     }
     return {
      width: newWidth,
      height: newHeight
     }
    } else return {width: 0, height: 0}
  }
}

export default AddImage;