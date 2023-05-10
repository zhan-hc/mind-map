import { Ref } from 'vue'
import { operateTotalType, operateType } from '../utils/type'
import { iconList, textPadding } from '../constant'
import Node, { ImageData, createNode, getChildNodeData } from '../common/node/node'
import { DrawRender } from '../common/draw/drawRender'
import AddImage from '../common/operate/addImage'
import { getTextWidth } from '../utils/common'
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
    // 添加图片
    else if (type === operateType.addImage) {
      const img = new AddImage()
      img.chooseImage((img: ImageData) => {
        checkNode.setImageData(img)
        const { height } = checkNode.attr
        checkNode.setAttr({
          ...checkNode.attr,
          height: img.height > height ? (img.height + textPadding * 2) : height,
          width: img.width + getTextWidth(checkNode, checkNode.text) + textPadding * 3
        })
        callbackObject[operateTotalType.IMG] && callbackObject[operateTotalType.IMG]()
      })
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