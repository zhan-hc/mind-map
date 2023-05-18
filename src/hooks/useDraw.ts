import { reactive, toRefs } from 'vue'
import DrawGenerator from "../common/draw/drawGenerator"
import { DrawRender } from "../common/draw/drawRender"
import { Paper } from "../common/paper"
import Position from "../common/position"
import Tree from "../common/tree"
import { DRAW_CALLBACK_TYPE, ExtraOption } from '../common/draw/type'
import Node, { getInitData } from '../common/node/node'
import { operateTotalType, operateType } from '../utils/type'
import EditTopic from '../common/operate/editTopic'
import useOperate from './useOperate'
import { getLocalStorage } from '../utils/common'
import { dataKey } from '../constant'
import { arrayToTree, treeToFlat } from '../utils/nodeUtils'

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
    data.tree = new Tree({data: getInitData()});
    // 如果缓存中有数据
    if (nodeData) {
      data.tree.setRoot(arrayToTree(JSON.parse(nodeData))[0])
    }
    data.paper = new Paper('#paper');
    data.drawGenerator = new DrawGenerator(data.paper.getPaper());
    data.drawRender = new DrawRender(data.paper, {...options, tree: data.tree});
    reDraw();
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
    console.log(rootTree, 'roottree')
    // 对节点重新计算位置
    position.getNodePosition(rootTree)
    data.paper?.clear()
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
      [operateTotalType.SAVE]: () => localStorage.setItem(dataKey, JSON.stringify(treeToFlat(data.tree?.getRoot())))
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

  return {
    ...toRefs(data),
    initPaper,
    reDraw,
    handleEditBlur,
    handleOperateFunc
  }
}