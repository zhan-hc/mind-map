import type { RaphaelElement, RaphaelAttributes, RaphaelSet } from 'raphael';
import { changeIconDisabled, forTreeEvent, getCenterXY, getRectData, isMobile } from '../../utils/common'
import { getNodeCenterPosition,  getNodeLevel,  getNodeRectAttr, getNodeRectBorder, getNodeRectInfo, getNodeTextAttr } from '../../utils/nodeUtils'
import { dragNodeInfo, textPadding } from '../../constant'
import { operateList } from '../../constant/operate'
import Node, { shapeAttr } from '../node/node';
import { Paper } from '../paper';
import DrawGenerator, { rectData } from './drawGenerator';
import { DRAW_CALLBACK_TYPE, ExtraOption, OPERATE_STATUS } from './type';
import { Viewport } from '../viewport';
import { insertAreaOption } from '../position';
import { NodeLevel, NodeTypeId } from '../node/helper';
import { CLICK_RECT_BORDER, DEFAULT_LINE_WIDTH, DRAG_PLACEHOLDER_LINE, DRAG_PLACEHOLDER_RECT, HOVER_RECT_BORDER, NONE_BORDER, LINE_COLOR, LINE_TYPE } from '../../constant/attr';
import EditTopic from '../operate/editTopic';
import { Ref, reactive, ref } from 'vue';
import Tree from '../tree';
import { NodeDrag } from '../node/node-drag';
import { NodeExpand } from '../node/node-expand';
import { ConnectLine } from './line';
import { useThrottleFn } from '@vueuse/core'
export interface Option extends ExtraOption {
  tree: Tree | null
}
interface renderData {
  checkNodeList: Array<Node> // 选中的边框
}
export class DrawRender {
  private readonly paper: Paper;
  private readonly drawGenerator: DrawGenerator;
  public viewport: Viewport;
  public data: renderData;
  public tree: Tree | null | undefined; // 树节点
  private editTopic: EditTopic | null; // 编辑
  private operateStatus: Ref<string>; // 操作状态
  private rapSetList: Array<RaphaelSet<"SVG" | "VML">>; // 每个节点的集合
  public ratio: number | undefined;
  public constructor(paper: Paper, option: Option) {
    this.paper = paper
    this.drawGenerator = paper.getDrawGenertator()
    this.operateStatus = ref('')
    this.editTopic = null
    this.tree = option.tree
    this.ratio = option.ratio && option.ratio.value
    this.data = reactive({ checkNodeList: [] })
    this.rapSetList = []
    this.viewport = new Viewport(paper, {
      ratio: option?.ratio || ref(0), 
      operateStatus: this.operateStatus, 
      cb: {
        checkBoxEvent: this.checkBoxEvent.bind(this), // 获取选中框里的node节点
        clearClickStatus: this.clearClickStatus.bind(this), // 清除选中状态
        setCheckNodeList: this.setCheckNodeList.bind(this) // 设置checkNodeList的值
      }
    })
    this.drawTopic = this.drawTopic.bind(this)
    this.setOperateStatus = this.setOperateStatus.bind(this)
    this.paperClick()
    
  }

  // 绘制节点
  public drawTopic (node:Node, checkNodeIds: string[], callback?: any) {
    const st = this.paper.getPaper().set()
    // 矩形节点
    const rect = this.drawGenerator.drawRect(getNodeRectInfo(node, 5), getNodeRectAttr(node, 0) as RaphaelAttributes) // 底层节点
    st.push(rect)
    // 图片
    const hasImg = node.imageData && node.imageData.url
    if (hasImg) {
      const image = this.drawGenerator.drawImage(node.imageData, { x: node.attr.x + textPadding, y: node.attr.y + textPadding } )
      st.push(image)
    }

    // 文本
    const {x, y} = getNodeCenterPosition(node)
    const text = this.drawGenerator.drawText({ x: x + (hasImg ? (node.imageData.width * 0.5) : 0), y }, node.text, getNodeTextAttr(node) as RaphaelAttributes)
    st.push(text)

    // 节点连接线
    const line = this.drawLine(node, {stroke: LINE_COLOR.value, 'stroke-width': 2} as RaphaelAttributes)
    if (line) {
      st.push(line)
    }

    // 最顶层矩形主要用于hover和click
    const wrapRect = this.drawWrapRect(node, callback || null)
    st.push(wrapRect)
    this.rapSetList.push(st)
    node.setShape(wrapRect)
    // 如果是新增节点则默认选中新节点
    if (checkNodeIds.length && checkNodeIds.includes(node.id)) {
      node.shape.attr(CLICK_RECT_BORDER)
      this.data.checkNodeList.push(node)
    }

    if (node.children && node.children.length) {
      // 绘制展开按钮
      const nodeExpan = new NodeExpand(this.drawGenerator, node);
      nodeExpan.expandIconClick(callback)
      // 如果子节点展开
      if (node.expand) {
        node.children.forEach((item: Node) => this.drawTopic(item, checkNodeIds, callback))
      }
    }
  }

  // 绘制最顶层的矩形节点(即悬浮可点击节点)
  public drawWrapRect (node: Node, cb?: any) {
    const that = this
    const data = getRectData(node)
    const wrapRect = this.drawGenerator.drawRect(getNodeRectBorder(node, 5, 4), getNodeRectAttr(node, 1) as RaphaelAttributes, data)
    // 为了事件委托中判断元素
    wrapRect.node.setAttribute('class', 'topic');
    // 拖拽事件
    if (cb && cb[DRAW_CALLBACK_TYPE.DRAG] && !isMobile) {
      const nodeDrag = new NodeDrag()
      // 节流dragmove
      const dragMoveHandler = (x: number, y: number, cx: number, cy: number, event: MouseEvent) => {
        that.setOperateStatus(OPERATE_STATUS.DRAG)
        nodeDrag.dragMove({cx, cy}, that.tree?.getRoot() as Node, node, that.drawDragRect.bind(that))
      }
      wrapRect.drag(
        useThrottleFn(dragMoveHandler, 100),
        function onstart (x,y,e) {
          that.editTopic?.blurInput()
        },
        function onend (e) {
          that.setOperateStatus(OPERATE_STATUS.NULL)
          nodeDrag.dragEnd(node, cb[DRAW_CALLBACK_TYPE.DRAG])
        }
      )
    }
    // 非选中节点才有hover/unhover效果
    wrapRect.hover(
      function(){
        !(that.data.checkNodeList.map(item => item.id).includes(this.data('node').id)) && this.attr(HOVER_RECT_BORDER);
      },
      function(){
        !(that.data.checkNodeList.map(item => item.id).includes(this.data('node').id)) && this.attr(NONE_BORDER);
      }
    )
    
    return wrapRect
  }

  // 绘制拖拽占位矩形
  public drawDragRect (insertArea: insertAreaOption, data?: rectData) {
    const st = this.paper.getPaper().set()
    const {x, y, x2, y2} = insertArea.area
    const { cx, cy } = getCenterXY(x, y, x2, y2)
    // 拖拽占位矩形
    const dNode =  {
      id: insertArea.id,
      father: insertArea.father,
      attr: {
        x: cx,
        y: cy - 0.5 * dragNodeInfo.height,
        width: dragNodeInfo.width,
        height: dragNodeInfo.height
      }
    }
    const rectInfo = {
      ...dNode.attr,
      radius: dragNodeInfo.radius
    }
    const rect = this.drawGenerator.drawRect(rectInfo, DRAG_PLACEHOLDER_RECT, data)
    const line = this.drawLine(dNode, DRAG_PLACEHOLDER_LINE) as RaphaelElement
    st.push(rect, line)
    if (data) {
      st.data(data.key, data.value)
    }
    return st
  }

  // 绘制节点链接线
  public drawLine (node: any, attr?: RaphaelAttributes) {
    const pNode = node.father
    if (!pNode) return
    let linePath = '';
    const cline = new ConnectLine(LINE_TYPE.value)
    // 是否是第一层节点，即与root连接的节点
    const firstLevel = getNodeLevel(node) === NodeLevel.second
    // 绘制当前节点的链接线
    linePath = cline.getLinePath(firstLevel, pNode, node)
    const drawAttr = attr ?? DEFAULT_LINE_WIDTH as RaphaelAttributes
    const line = this.drawGenerator.drawLine(linePath, drawAttr)
    line.toBack()
    return line
  }

  public get checkNodeList () {
    return this.data.checkNodeList
  }

  public getPaperElement (container: string | Element) : HTMLElement {
    const containerDom = (typeof container === 'string' ? document.querySelector(container) : container) as HTMLElement
    if (!containerDom) {
      throw new Error(`${container} is not exist`);
    }
    if (containerDom.clientWidth === 0 || containerDom.clientHeight === 0) {
      throw new Error('The width or height of Container is not more than 0')
    }
    return containerDom
  }

  public setEditTopic (edit: EditTopic) {
    this.editTopic = edit
  }

  public setOperateStatus (val: string) {
    this.operateStatus.value = val
  }

  public setCheckNodeList (val: Array<Node>) {
    this.data.checkNodeList = val
  }

  public setRapSetList (val: Array<RaphaelSet<"SVG" | "VML">>) {
    this.rapSetList = val
  }

  // 改变选中的节点
  public changeCheckTopic(node: Node) {
    this.data.checkNodeList.forEach(item => item.shape.attr(NONE_BORDER))
    this.data.checkNodeList = [node]
    // 更新操作栏的图标状态
    changeIconDisabled(this.data.checkNodeList, operateList)
    // 选中当前节点
    node.shape.attr(CLICK_RECT_BORDER)
  }

  // 节点点击事件
  private topicClickEvent (e: Event, node: Node) {
    // 移动至可视区域
    this.moveViewArea(node.shape.node)
    // 编辑的时候触发了点击则失焦
    if (this.editTopic?.editStatus) {
      this.editTopic.editInput?.blur()
    }
    this.changeCheckTopic(node)
  }

  // 事件委托处理点击事件
  private paperClick () {
    const that = this
    const mousedownName = isMobile ? 'touchstart' : 'click';
    this.paper.getPaper().canvas.addEventListener(mousedownName, function (e: Event) {
      const target: any = e.target
      if (target.getAttribute('class') === 'topic') {
        const ele = that.getSetNode(target.raphaelid)
        if (ele) {
          const node = ele.data('node')
          that.topicClickEvent(e, node)
        }
      } else {
        that.clearClickStatus()
        that.setCheckNodeList([])
      }
    })
  }

  // 获取集合里的node节点
  public getSetNode (raphaelid: number) {
    const len = this.rapSetList.length
    let node = null
    for (let i = 0;i < len; i++) {
      const set = this.rapSetList[i]
      const setlen = set.length
      if (raphaelid === set[setlen - 1].id) {
        node = set[setlen - 1]
        break;
      }
    }
    return node
  }

  // 移动至可视区域
  public moveViewArea (node: SVGRectElement | Element) {
    const {width, height} = this.paper.getPaper()
    // // 当元素被遮挡时，让其完全出现可视区域
    let { top, left, right, bottom } = node.getBoundingClientRect()
    right = width - right
    bottom = height - bottom
    let moveX = this.viewport.getScaleOption().x;
    let moveY = this.viewport.getScaleOption().y;
    const event = [(val: number) => (moveY += val), (val: number) => (moveX += val), (val: number) => (moveX -= val), (val: number) => (moveY -= val)];
    const UDLR = [top, left, right, bottom]
    if (UDLR.some(item => item < 0)) {
      UDLR.forEach((item, i) => {
        (item < 0) &&  event[i](item);
      })
      this.paper.getPaper().setViewBox(moveX, moveY, this.viewport.getScaleOption().w, this.viewport.getScaleOption().h, false);
    }
  }

  // 单击选择框的事件（查找节点在框里的节点）
  public checkBoxEvent (attrs: shapeAttr, nodeList: Array<Node> = []) {
    const {width, height} = attrs
    forTreeEvent(this.tree?.getRoot() as Node, (node: Node) => {
      const { x, y, x2, y2 } = node.shape.getBBox()
      if (x > attrs.x && y > attrs.y && x2 < attrs.x + width && y2 < attrs.y + height) {
        nodeList.push(node)
      }
    })
    return nodeList
  }

  // 清空点击状态
  public clearClickStatus () {
    this.data.checkNodeList.forEach(item => item.shape.attr(NONE_BORDER));
    changeIconDisabled([], operateList);
    this.editTopic?.blurInput()
  }
}