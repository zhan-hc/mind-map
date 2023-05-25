import { reactive, toRefs } from 'vue'
import DrawGenerator from "../common/draw/drawGenerator"
import { DrawRender } from "../common/draw/drawRender"
import { Paper } from "../common/paper"
import Position from "../common/position"
import Tree from "../common/tree"
import { DRAW_CALLBACK_TYPE, ExtraOption } from '../common/draw/type'
import Node, { ImageData, getInitData } from '../common/node/node'
import { lineList, operateTotalType, operateType } from '../constant/operate'
import EditTopic from '../common/operate/editTopic'
import useOperate from './useOperate'
import { changeLineType, forTreeEvent, getLocalStorage } from '../utils/common'
import { dataKey, optionKey } from '../constant'
import { arrayToTree, treeToFlat } from '../utils/nodeUtils'
import { uploadImage } from '../services/upload'
import { hideLoading, showLoading } from '../utils/loading'
import { ElMessage } from 'element-plus'

interface dataOption {
  tree:  Tree | null;
  paper: Paper | null;
  drawGenerator: DrawGenerator | null;
  drawRender: DrawRender | null;
  callbacks: any;
}

export default function () {
  const { handleOperate } = useOperate()
  let editTopic: EditTopic | null = null 
  const data: dataOption = reactive({
    tree:  null,
    paper:  null,
    drawGenerator: null,
    drawRender: null,
    callbacks: {}
  })

  /**
   * 初始化画布
   * @param options 
   */
  function initPaper (options: ExtraOption) {
    const nodeData = getLocalStorage(dataKey)
    const optionData = getLocalStorage(optionKey)
    data.tree = new Tree({data: getInitData()});
    // 如果缓存中有数据
    if (nodeData) {
      data.tree.setRoot(arrayToTree(JSON.parse(nodeData))[0])
    }
    data.paper = new Paper('#paper');
    data.drawGenerator = new DrawGenerator(data.paper.getPaper());
    data.drawRender = new DrawRender(data.paper, {...options, tree: data.tree});
    if (optionData && JSON.parse(optionData).lineType) {
      changeLineType(lineList, JSON.parse(optionData).lineType)
      data.drawRender.setLineType(JSON.parse(optionData).lineType)
    }
    reDraw();
    // 默认选中根节点
    data.drawRender.changeCheckTopic(data.tree?.getRoot() as Node)
    editTopic = new EditTopic({
      wrapName: '.edit-wrap',
      inputName: '.edit-text'
    })
    data.drawRender?.setEditTopic(editTopic)
  }

  /**
   * 重绘
   * @param newNodeId 
   * @param cb 
   */
  function reDraw (newNodeId = '', cb?: any) {
    const position = new Position()
    const rootTree = (data.tree as Tree).getRoot()
    // 对节点重新计算位置
    position.getNodePosition(rootTree)
    data.paper?.clear()
    // const { width, height } = data.paper?.getPaperAttr()
    // data.drawRender?.drawParentRect(width, height)
    // 展开按钮的回调
    const callbackObj = {
      [DRAW_CALLBACK_TYPE.EXPAND]: function () {
        reDraw()
      },
      [DRAW_CALLBACK_TYPE.DRAG]: function () {
        reDraw()
      },
      ...cb
    }
    data.drawRender?.setRapSetList([])
    data.tree && data.drawRender?.drawTopic(rootTree, newNodeId, callbackObj)
  }


  /**
   * 节点操作事件
   * @param type 
   */
  function handleOperateFunc (type: operateType) {
    data.callbacks = {
      [operateTotalType.ADD]: (id: string) => reDraw(id),
      [operateTotalType.EDIT]: () => editTopic?.editText(data.drawRender?.data.checkNodeList[0] as Node, data.drawRender?.ratio as number),
      [operateTotalType.IMG]: (id: string) => reDraw(id),
      [operateTotalType.DELETE]: () => reDraw(),
      [operateTotalType.SAVE]: () => saveData()
    }
    handleOperate(data.drawRender?.data.checkNodeList as Array<Node>, type, data.callbacks)
  }
  /**
   * 编辑框失焦事件
   * @param e 
   */
  function handleEditBlur (e: Event) {
    editTopic && (editTopic as EditTopic).addEventBlur(e, data.drawRender?.data.checkNodeList[0] as Node, () => reDraw())
  }
  // 保存数据
  async function saveData () {
    showLoading({ text: '保存数据中...' })
    const haveImgNodes: Node[] = []
    forTreeEvent(data.tree?.getRoot() as Node, (node: any) => {
      if (node.imageData && node.imageData.url && !/^https./.test(node.imageData.url)) {
        haveImgNodes.push(node)
      }
    })
    if (haveImgNodes.length) {
      const res:any[] = await Promise.all(haveImgNodes.map(item => {
        let data = new FormData();
        data.append('file',item?.imageData?.file || '');
        data.append('permission','1');
        data.append('strategy_id','0');
        data.append('album_id','0');
        return uploadImage(data)
      }))
      haveImgNodes.forEach((item, i) => {
        const imgData = {
          ...item.imageData,
          url: res[i].data.links.url
        } as ImageData
        item.setImageData(imgData)
      })
    }
    localStorage.setItem(dataKey, JSON.stringify(treeToFlat(data.tree?.getRoot())))
    localStorage.setItem(optionKey, JSON.stringify({lineType: lineList.find(item => item.checked)?.value}))
    hideLoading()
    ElMessage.success({ message: '保存数据成功' })
  }

  function handleCommand (lineVal: number) {
    changeLineType(lineList, lineVal)
    data.drawRender?.setLineType(lineVal)
    reDraw()
  }

  return {
    ...toRefs(data),
    initPaper,
    reDraw,
    handleEditBlur,
    handleCommand,
    handleOperateFunc
  }
}