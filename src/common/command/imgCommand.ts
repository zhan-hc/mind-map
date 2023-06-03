import { textPadding } from "../../constant";
import { imgType, operateTotalType } from "../../constant/operate";
import { getTextWidth } from "../../utils/common";
import { getNodeLevel } from "../../utils/nodeUtils";
import { NodeInfo } from "../node/helper";
import Node, { ImageData } from "../node/node";
import AddImage from "../operate/addImage";
import { Command } from "./type";

export default class ImgCommand implements Command{
  public type: string;
  public lastCheckNodeIds: string[]
  private imgInfo: ImageData | undefined // 保存图片信息
  private lastImgInfo: ImageData | undefined
  constructor(public node: Node, public imgOperate: number) {
    this.type = operateTotalType.IMG
    this.lastCheckNodeIds = [node.id]
    this.imgInfo = undefined
    this.lastImgInfo = node.imageData
  }

  async execute() {
    this.imgOperate === imgType.add && await this.addImage()
    this.imgOperate === imgType.delete && this.clearImage()
  }

  undo () {
    //  && this.clearImage()
    if (this.imgOperate === imgType.add && this.lastImgInfo) {
      this.addImage(this.lastImgInfo)
    } else {
      this.clearImage()
    }
    this.imgOperate === imgType.delete && this.addImage()
  }
  async addImage (imgInfo?: ImageData) {
    const img = new AddImage()
    const imgData = imgInfo || this.imgInfo || await img.chooseImage()
    !imgInfo && (this.imgInfo = imgData)
    this.node.setImageData(imgData)
    this.node.setAttr({
      ... this.node.attr,
      height: imgData.height + textPadding * 2,
      width: imgData.width + getTextWidth( this.node, this.node.text) + textPadding * 3
    })
  }

  clearImage () {
    this.node.setImageData(undefined)
    this.node.setAttr({
      ...this.node.attr,
      height: NodeInfo[getNodeLevel(this.node)].attr.height,
      width: getTextWidth(this.node, this.node.text) + textPadding * 2
    })
  }
}