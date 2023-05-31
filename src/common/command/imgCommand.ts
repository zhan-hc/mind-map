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
  public imgInfo: ImageData | undefined // 保存图片信息
  constructor(public node: Node, public imgOperate: number) {
    this.type = operateTotalType.IMG
    this.lastCheckNodeIds = [node.id]
    this.imgInfo = node.imageData
  }

  async execute() {
    this.imgOperate === imgType.add && await this.addImage()
    this.imgOperate === imgType.delete && this.clearImage()
  }

  undo () {
    this.imgOperate === imgType.add && this.clearImage()
    this.imgOperate === imgType.delete && this.addImage()
  }
  async addImage () {
    const img = new AddImage()
    const imgData = this.imgInfo || await img.chooseImage()
    this.imgInfo = imgData
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