import { operateTotalType, operateType } from "../../constant/operate";
import Node from "../node/node";
import EditTopic from "../operate/editTopic";

export default class EditCommand implements Command{
  public type: string;
  public lastCheckNodeIds: string[];
  public lastTextInfo: { // 存储上一次的文本信息
    text: string,
    width: number,
    height: number
  };
  public operateStatus: boolean // 是否操作过（主要为了处理恢复逻辑）
  constructor(public node: Node, public editTopic: EditTopic) {
    this.type = operateTotalType.EDIT
    this.lastTextInfo = this.getNodeTextInfo()
    this.lastCheckNodeIds = [node.id]
    this.operateStatus = false
  }

  execute() {
    if (!this.operateStatus) {
      this.editTopic.editText(this.node)
      this.operateStatus = true
    } else {
      const lastInfo = {...this.getNodeTextInfo()}
      this.editText()
      this.lastTextInfo = lastInfo
    }
  }

  undo () {
    const lastInfo = {...this.getNodeTextInfo()}
    this.editText()
    this.lastTextInfo = lastInfo // 恢复时需要用到
  }

  editText () {
    this.node.setText(this.lastTextInfo.text)
    this.node.setAttr({
      ...this.node.attr,
      width: this.lastTextInfo.width,
      height: this.lastTextInfo.height
    })
  }

  getNodeTextInfo () {
    return {
      text: this.node.text,
      width: this.node.attr.width,
      height: this.node.attr.height
    }
  }
}