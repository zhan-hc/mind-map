import { operateTotalType, operateType } from '../constant/operate'
import { textPadding } from '../constant'
import Node, { ImageData, createNode, getChildNodeData } from '../common/node/node'
import AddImage from '../common/operate/addImage'
import { forTreeEvent, getTextWidth } from '../utils/common'
export default function () {


  function handleOperate (checkNodeList: Array<Node>, type: operateType, callbackObject?: any) {
    const checkNode = checkNodeList[0]
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
    // 添加图片
    else if (type === operateType.addImage) {
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
    }
    // 删除节点
    else if (type === operateType.delTopic) {
      checkNodeList.forEach(item => item.father?.removeChild(item))
      callbackObject[operateTotalType.DELETE] && callbackObject[operateTotalType.DELETE]()
    }
    // 保存数据
    else if (type === operateType.saveData) {
      callbackObject[operateTotalType.SAVE] && callbackObject[operateTotalType.SAVE]()
    }
  }

  return {
    handleOperate
  }
}