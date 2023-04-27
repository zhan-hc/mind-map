import { Ref } from "vue";
import { NodeTextPadding } from "../../constant";
import { getTextWidth } from "../../utils/common";
import { getNodeLevel } from "../../utils/nodeUtils";
import { DrawRender } from "../draw/drawRender";
import { NodeFontSize } from "../node/helper";
import Node from "../node/node";

class EditTopic {
  private editWrap: HTMLElement | null;
  private editInput: HTMLElement | null;
  private editStatus: boolean;
  public constructor ({
    wrapName,
    inputName
  }: {
    wrapName: string;
    inputName: string
  }) {
    const { editWrap, editInput } = this.getEditEle(wrapName, inputName)
    this.editWrap = editWrap
    this.editInput = editInput
    this.editStatus = false
    document.addEventListener('keydown', this.EventKeydown.bind(this))
  }

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

  public editText (checkNode: Node) {
    if (!this.editWrap) return
    this.editWrap.style.top = `${checkNode.attr.y * 1 + 15}px`;
    this.editWrap.style.left = `${checkNode.attr.x * 1 + 15}px`;
    this.editWrap.style.height = NodeFontSize[getNodeLevel(checkNode)];
    this.showEditWrap()
    this.editInput && (this.editInput.innerText = checkNode.text);
    this.editInput?.focus()
    this.editStatus = true
  }

  private hideEditWrap () {
    this.editWrap && (this.editWrap.style.display = 'none')
  }

  private showEditWrap () {
    this.editWrap && (this.editWrap.style.display = 'block')
  }

  // 失焦事件
  public addEventBlus (drawRender: Ref<DrawRender | null>, callback: Function) {
    const _that = this
    this.editInput?.addEventListener('blur',function(e){
      const checkNode = drawRender.value?.checkNode as Node
      const target = e.target as HTMLElement;
      _that.hideEditWrap()
      // 设置选中节点的宽高
      checkNode.setAttr({
        ...checkNode.attr,
        width: getTextWidth(checkNode, target.innerText) + NodeTextPadding[getNodeLevel(checkNode)] * 2
      })
      checkNode.setText(target.innerText);
      _that.editStatus = true
      if (callback) callback();
    })
  }

  // 回车事件
  public EventKeydown (e: KeyboardEvent) {
    if (e.code === 'Enter') {
      this.editInput?.blur()
    }
  }
}

export default EditTopic;