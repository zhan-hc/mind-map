import { reactive, toRefs } from 'vue'
import DrawGenerator from "../common/draw/drawGenerator"
import { DrawRender } from "../common/draw/drawRender"
import { Paper } from "../common/paper"
import Position from "../common/position"
import Tree from "../common/tree"
import { DRAW_CALLBACK_TYPE, ExtraOption } from '../common/draw/type'
import Node, { ImageData, getChildNodeData, getInitData } from '../common/node/node'
import { lineList, operateList, operateType } from '../constant/operate'
import EditTopic from '../common/operate/editTopic'
import { changeIconDisabled, changeLineType, changeSnapshotDisabled, forTreeEvent, getLocalStorage } from '../utils/common'
import { dataKey, optionKey } from '../constant'
import { arrayToTree, treeToFlat } from '../utils/nodeUtils'
import { uploadImage } from '../services/upload'
import { hideLoading, showLoading } from '../utils/loading'
import { ElMessage } from 'element-plus'
import { NodeInfo } from '../common/node/helper'
import { LINE_COLOR, LINE_TYPE } from '../constant/attr'
import CommandManager from '../common/command/commandManager'
import AddCommand from '../common/command/addCommand'
import DelCommand from '../common/command/delCommand'
import ImgCommand from '../common/command/imgCommand'
import EditCommand from '../common/command/editCommand'
import StyleCommand from '../common/command/styleCommand'

interface dataOption {
  tree:  Tree | null;
  paper: Paper | null;
  drawGenerator: DrawGenerator | null;
  drawRender: DrawRender | null;
  callbacks: any;
  command: CommandManager  | null;
}

export default function () {
  let editTopic: EditTopic | null = null 
  const data: dataOption = reactive({
    tree:  null,
    paper:  null,
    drawGenerator: null,
    drawRender: null,
    callbacks: {},
    command: null
  })

  /**
   * 初始化画布
   * @param options 
   */
  function initPaper (options: ExtraOption) {
    data.tree = new Tree({data: getInitData()});
    initSetData()
    data.paper = new Paper('#paper');
    data.drawGenerator = new DrawGenerator(data.paper.getPaper());
    data.drawRender = new DrawRender(data.paper, {...options, tree: data.tree});
    data.command = new CommandManager()
    reDraw([data.tree?.getRoot().id]);
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
  function reDraw (checkNodeIds: string[] = [], cb?: any) {
    const position = new Position()
    const rootTree = (data.tree as Tree).getRoot()
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
    data.drawRender?.setRapSetList([])
    data.drawRender?.setCheckNodeList([])
    data.tree && data.drawRender?.drawTopic(rootTree, checkNodeIds, callbackObj)
    changeIconDisabled(data.drawRender?.checkNodeList as Node[], operateList)
  }

  // 获取操作的逻辑
  const getOperateFunc = (type: operateType, extraVal: number) => {
    const checkNodes = data.drawRender?.checkNodeList as Node[]
    const checkNode = checkNodes[0]
    const objOperate = {
      [operateType.addTopic]: () => { // 添加同级节点
        const newNode = data.tree?.createNode(getChildNodeData(type, checkNode)) as Node;
        const addCommand = new AddCommand(newNode, checkNode, type)
        addCommand.execute()
        data.command?.pushCommand(addCommand)
        reDraw([newNode.id])
      },
      [operateType.addSubTopic]: () => { // 添加子级节点
        const newNode = data.tree?.createNode(getChildNodeData(type, checkNode)) as Node;
        const addCommand = new AddCommand(newNode, checkNode, type)
        addCommand.execute()
        data.command?.pushCommand(addCommand)
        reDraw([newNode.id])
      },
      [operateType.editTopic]: () => { // 编辑操作
        const editCommand = new EditCommand(checkNode, editTopic as EditTopic)
        editCommand.execute()
        data.command?.pushCommand(editCommand)
      },
      [operateType.operateImg]: async () => { // 图片操作
        const imgCommand = new ImgCommand(checkNode, extraVal)
        await imgCommand.execute()
        data.command?.pushCommand(imgCommand)
        reDraw([])
      },
      [operateType.delTopic]: () => { // 删除节点
        const delCommand = new DelCommand(checkNodes)
        delCommand.execute()
        data.command?.pushCommand(delCommand)
        reDraw(checkNodes.map(item => item.id))
      },
      [operateType.saveData]: () => saveData(), // 保存数据
      [operateType.execute]: () => {
        const curCommand = data.command?.getExectedCommands()
        data.command?.pushUndoCommand(curCommand)
        curCommand.execute()
        reDraw([curCommand?.node?.id] || [])
      },
      [operateType.undo]: () => {
        const curCommand = data.command?.popCommand()
        curCommand.undo()
        reDraw(curCommand.lastCheckNodeIds || [])
      }
    }
    return objOperate[type]
  }

  /**
   * 节点操作事件
   * @param type 
   * @param extraVal 额外的值 
   */
  async function handleOperateFunc (type: operateType, extraVal: number) {
    await getOperateFunc(type, extraVal)()
    changeSnapshotDisabled(data.command as CommandManager, operateList)
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
    localStorage.setItem(optionKey, JSON.stringify({
      lineType: LINE_TYPE.value,
      nodeInfo: NodeInfo,
      LINE_COLOR: LINE_COLOR.value
    }))
    hideLoading()
    ElMessage.success({ message: '保存数据成功' })
  }

  // 初始化设置缓存配置信息
  function initSetData () {
    const nodeData = getLocalStorage(dataKey)
    const optionData = getLocalStorage(optionKey)
    // 如果缓存中有节点数据
    if (nodeData) {
      data.tree?.setRoot(arrayToTree(JSON.parse(nodeData))[0])
    }
    // 如果有配置信息的数据
    if (optionData) {
      const options = JSON.parse(optionData)
      // 线条类型
      if (options.lineType) {
        changeLineType(lineList, JSON.parse(optionData).lineType)
        LINE_TYPE.value = JSON.parse(optionData).lineType
      }
      // 节点信息
      if (options.nodeInfo) {
        Object.keys(options.nodeInfo).forEach(level => {
          NodeInfo[level] = options.nodeInfo[level]
        })
      }
      // 线条颜色
      if (options.LINE_COLOR) {
        LINE_COLOR.value = options.LINE_COLOR
      }
    }
  }

  // 样式配置
  function handleCommand (style: {value: number, type: number, key: string}) {
    const lineCommand = new StyleCommand(style)
    lineCommand.execute()
    data.command?.pushCommand(lineCommand)
    reDraw()
    changeSnapshotDisabled(data.command as CommandManager, operateList)
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