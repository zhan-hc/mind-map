import { Ref } from 'vue'
import { operateTotalType, operateType } from '../utils/type'
import { iconList } from '../constant'
import Node, { createNode, getChildNodeData } from '../common/node/node'
import { DrawRender } from '../common/draw/drawRender'
export default function () {

  const changeDisable = (type: operateType, value: boolean) => {
    iconList.forEach(item => {
      if (item.type === type) {
        item.disabled = value
      }
    })
  }

  function handleOperate (drawRender: Ref<DrawRender | null>, type: operateType, callbackObject?: any) {
    const checkNode = drawRender.value?.checkNode as Node
    // 增加节点
    if ([operateType.addTopic, operateType.addSubTopic].includes(type)) {
      const newNode = createNode(getChildNodeData(type, checkNode));
      (type === operateType.addTopic) && checkNode.father?.insertAfterChild(checkNode, newNode);
      (type === operateType.addSubTopic) && checkNode.pushChild(newNode);
      callbackObject[operateTotalType.ADD] && callbackObject[operateTotalType.ADD](newNode.id)
    }
    // 编辑节点
    else if (type === operateType.editTopic) {
      callbackObject[operateTotalType.EDIT] && callbackObject[operateTotalType.EDIT]()
    }
    // 删除节点
    else if (type === operateType.delTopic) {
      checkNode.father?.removeChild(checkNode)
      callbackObject[operateTotalType.DELETE]() && callbackObject[operateTotalType.DELETE]()
    }
  }

  return {
    changeDisable,
    handleOperate
  }
}