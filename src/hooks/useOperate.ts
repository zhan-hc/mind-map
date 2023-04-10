import { Ref } from 'vue'
import { operateTotalType, operateType } from '../utils/type'
import { iconList, flatNodes, textPadding } from '../constant'
import { createNode, NodeOptions } from '../common/node'
import { DrawRender } from '../common/draw/drawRender'
import { TreeOption } from '../common/tree'
import { getNodeInfo, getTextWidth, sortNodes } from '../utils/common'
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
      callbackObject[operateTotalType.add](newNode.id)
    } else if (type === operateType.editTopic) {
      const curNodeDom = document.querySelector('.node-edit-wrap');
      const NodeTextDom = document.querySelector('.node-text');
      (curNodeDom as HTMLElement).style.top = `${(drawRender.value?.checkNode as TreeOption).y * 1 + 15}px`;
      (curNodeDom as HTMLElement).style.left = `${(drawRender.value?.checkNode as TreeOption).x * 1 + 15}px`;
      (curNodeDom as HTMLElement).style.height = getNodeInfo(NodeInfo.fontSize, drawRender.value?.checkNode as TreeOption);
      (curNodeDom as HTMLElement).style.display = 'block';
      (NodeTextDom as HTMLElement).innerText = (drawRender.value?.checkNode as TreeOption).text;
      (NodeTextDom as HTMLElement).focus()
      callbackObject[operateTotalType.edit]()
    }
  }

  function addEditToBlur (drawRender: Ref<DrawRender | null>, callback?: Function) {
    const curNodeDom = document.querySelector('.node-edit-wrap')
    const NodeTextDom = document.querySelector('.node-text');
    (NodeTextDom as HTMLElement).addEventListener('blur',function(e){
      const target = e.target as HTMLElement
      (curNodeDom as HTMLElement).style.display = 'none';
      const editNode = flatNodes.find(item => item.id === (drawRender.value?.checkNode as TreeOption).id);
      (editNode as NodeOptions).width = getTextWidth((drawRender.value?.checkNode as TreeOption), target.innerText) + textPadding * 2;
      (editNode as NodeOptions).text = target.innerText
      if (callback) callback()
      
    })
  }

  return {
    changeDisable,
    handleOperate,
    addEditToBlur
  }
}