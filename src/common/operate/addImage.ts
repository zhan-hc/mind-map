class AddImage {
  private _filePath: string;
  public constructor () {
    this._filePath = ''
  }
  public get filePath () {
    return this._filePath
  }
  public chooseImage (cb: Function) {
    const that = this
    let input = document.createElement("input");
      input.setAttribute("type", "file");
      // input.setAttribute("multiple", "multiple"); // 支持多选
      input.accept = "image/*";
      input.addEventListener("change", (e: any) => {
          let file = e.target.files[0];
          // 浏览器兼容性处理（有的浏览器仅存在 Window.URL）
          const windowURL = window.URL || window.webkitURL;
          that._filePath = windowURL.createObjectURL(file);
          const img = new Image();
          img.src = that._filePath
          img.onload = function () {
            cb({
              url: that._filePath,
              width: img.width,
              height: img.height
            })
          }
      });
      input.click();
  }
}

export default AddImage;