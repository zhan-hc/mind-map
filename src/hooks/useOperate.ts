import { Ref } from 'vue'
import { operateTotalType, operateType } from '../utils/type'
import { iconList, flatNodes, textPadding, NodeTextPadding } from '../constant'
import { createNode, NodeOptions } from '../common/node'
import { DrawRender } from '../common/draw/drawRender'
import { TreeOption } from '../common/tree'
import { getNodeInfo, getNodeLevel, getTextWidth, sortNodes } from '../utils/common'
import { NodeInfo } from '../common/node/helper'
export default function () {

  const changeDisable = (type: operateType, value: boolean) => {
    iconList.forEach(item => {
      if (item.type === type) {
        item.disabled = value
      }
    })
  }

  function handleOperate (drawRender: Ref<DrawRender | null>, type: operateType, callbackObject?: any) {
    if ([operateType.addTopic, operateType.addSubTopic].includes(type)) {
      const newNode = createNode(drawRender.value?.checkNode as TreeOption, type)
      flatNodes.push(newNode)
      // 重新对当前节点的sort属性排序
      sortNodes(newNode, type)

      if (callbackObject[operateTotalType.ADD]) callbackObject[operateTotalType.ADD](newNode.id)
    }
    else if (type === operateType.editTopic) {
      const curNodeDom = document.querySelector('.node-edit-wrap') as HTMLElement;
      const NodeTextDom = document.querySelector('.node-text') as HTMLElement;
      const checkNode = drawRender.value?.checkNode as TreeOption;
      // 设置编辑输入框的位置
      curNodeDom.style.top = `${checkNode.y * 1 + 15}px`;
      curNodeDom.style.left = `${checkNode.x * 1 + 15}px`;
      curNodeDom.style.height = getNodeInfo(NodeInfo.fontSize, checkNode);
      curNodeDom.style.display = 'block';
      NodeTextDom.innerText = checkNode.text;
      NodeTextDom.focus();

      if (callbackObject[operateTotalType.EDIT]) callbackObject[operateTotalType.EDIT]()
    }
    else if (type === operateType.delTopic) {
      if ( callbackObject[operateTotalType.DELETE]()) callbackObject[operateTotalType.DELETE]()
    }
  }

  // 添加编辑输入框的失焦事件
  function addEditToBlur (drawRender: Ref<DrawRender | null>, callback?: Function) {
    const curNodeDom = document.querySelector('.node-edit-wrap') as HTMLElement;
    const NodeTextDom = document.querySelector('.node-text') as HTMLElement;

    NodeTextDom.addEventListener('blur',function(e){
      const target = e.target as HTMLElement;
      const checkNode = drawRender.value?.checkNode as TreeOption;
      curNodeDom.style.display = 'none';
      // 设置选中节点的宽高
      const editNode = flatNodes.find(item => item.id === checkNode.id) as NodeOptions;
      editNode.width = getTextWidth(checkNode, target.innerText) + NodeTextPadding[getNodeLevel(checkNode)] * 2;
      editNode.text = target.innerText;
      
      if (callback) callback();
    })
  }

  return {
    changeDisable,
    handleOperate,
    addEditToBlur
  }
}