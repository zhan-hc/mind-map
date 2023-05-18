import { textPadding } from "../../constant";
import { getTextWidth } from "../../utils/common";
import { getNodeLevel } from "../../utils/nodeUtils";
import { NodeInfo } from "../node/helper";
import Node from "../node/node";

class EditTopic {
  private editWrap: HTMLElement | null;
  private _editInput: HTMLElement | null;
  private _editStatus: boolean;
  public constructor ({
    wrapName,
    inputName
  }: {
    wrapName: string;
    inputName: string
  }) {
    const { editWrap, editInput } = this.getEditEle(wrapName, inputName)
    this.editWrap = editWrap
    this._editInput = editInput
    this._editStatus = false
    document.addEventListener('keydown', this.EventKeydown.bind(this))
    this.blurInput = this.blurInput.bind(this)
  }

  
  public get editStatus () { return this._editStatus }
  public get editInput () { return this._editInput }

  public getEditEle (wrapName: string, inputName: string) {
    const editWrap = document.querySelector(wrapName) as HTMLElement
    const editInput = document.querySelector(inputName) as HTMLElement
    if (!editWrap || !editInput) {
      throw new Error(`${wrapName} or ${inputName} is not exist`);
    }
    return {
      editWrap,
      editInput
    }
  }

  public editText (checkNode: Node, ratio: number) {
    if (!this.editWrap) return
    const { top, left } = checkNode.shape.node.getBoundingClientRect()
    this.editWrap.style.top = `${top + textPadding * (ratio / 100)}px`;
    this.editWrap.style.left = `${left + textPadding * (ratio / 100)}px`;
    this.editWrap.style.height = NodeInfo[getNodeLevel(checkNode)].fontSize * (ratio / 100) + 'px';
    this.showEditWrap()
    this._editInput && (this._editInput.innerText = checkNode.text);
    this.moveCursorEnd()
    this._editInput?.focus()
    this._editStatus = true
  }

  private hideEditWrap () {
    this.editWrap && (this.editWrap.style.display = 'none')
  }

  private showEditWrap () {
    this.editWrap && (this.editWrap.style.display = 'block')
  }

  public blurInput () {
    if (this.editStatus) {
      this.editInput?.blur()
    }
  }

  // 失焦事件
  public addEventBlur (e: Event, checkNode: Node, callback?: Function) {
    const target = e.target as HTMLElement;
    const hasImg = checkNode?.imageData && checkNode.imageData.url
    this.hideEditWrap()
    // 设置选中节点的宽高
    checkNode.setAttr({
      ...checkNode.attr,
      width: getTextWidth(checkNode, target.innerText) + NodeInfo[getNodeLevel(checkNode)].textPadding * (hasImg ? 3 : 2) + (hasImg ? checkNode.imageData?.width : 0)
    })
    checkNode.setText(target.innerText);
    this._editStatus = false
    if (callback) callback();
  }

  // 回车事件
  public EventKeydown (e: KeyboardEvent) {
    if (e.code === 'Enter') {
      this._editInput?.blur()
    }
  }

  public moveCursorEnd () {
    const range = window.getSelection()
    if (range) {
      range.selectAllChildren(this._editInput as HTMLElement)
      range.collapseToEnd()
    }
  }
}

export default EditTopic;