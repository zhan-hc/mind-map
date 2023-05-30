import { operateTotalType, operateType } from '../constant/operate'
import { textPadding } from '../constant'
import Node, { ImageData, createNode, getChildNodeData } from '../common/node/node'
import AddImage from '../common/operate/addImage'
import { getTextWidth } from '../utils/common'
import { getNodeLevel } from '../utils/nodeUtils'
import { NodeInfo } from '../common/node/helper'
export default function () {


  function handleOperate (checkNodeList: Array<Node>, operate: {type: operateType, crud: number}, callbackObject?: any) {
    const checkNode = checkNodeList[0]
    // 增加节点
    if ([operateType.addTopic, operateType.addSubTopic].includes(operate.type)) {
      const newNode = createNode(getChildNodeData(operate.type, checkNode));
      (operate.type === operateType.addTopic) && checkNode.father?.insertAfterChild(checkNode, newNode);
      (operate.type === operateType.addSubTopic) && checkNode.pushChild(newNode);
      callbackObject[operateTotalType.ADD] && callbackObject[operateTotalType.ADD](newNode)
    }
    // 编辑节点
    else if (operate.type === operateType.editTopic) {
      callbackObject[operateTotalType.EDIT] && callbackObject[operateTotalType.EDIT]()
    }
    // 操作图片
    else if (operate.type === operateType.operateImg) {
      // 添加图片
      if (operate.crud === 1) {
        const img = new AddImage()
        img.chooseImage((img: ImageData) => {
          checkNode.setImageData(img)
          checkNode.setAttr({
            ...checkNode.attr,
            height: img.height + textPadding * 2,
            width: img.width + getTextWidth(checkNode, checkNode.text) + textPadding * 3
          })
          callbackObject[operateTotalType.IMG] && callbackObject[operateTotalType.IMG]()
        })
      } else {
        checkNode.setImageData(undefined)
        checkNode.setAttr({
          ...checkNode.attr,
          height: NodeInfo[getNodeLevel(checkNode)].attr.height,
          width: getTextWidth(checkNode, checkNode.text) + textPadding * 2
        })
        callbackObject[operateTotalType.IMG] && callbackObject[operateTotalType.IMG]()
      }
    }
    // 删除节点
    else if (operate.type === operateType.delTopic) {
      checkNodeList.forEach(item => item.father?.removeChild(item))
      callbackObject[operateTotalType.DELETE] && callbackObject[operateTotalType.DELETE]()
    }
    // 保存数据
    else if (operate.type === operateType.saveData) {
      callbackObject[operateTotalType.SAVE] && callbackObject[operateTotalType.SAVE]()
    }
  }

  return {
    handleOperate
  }
}