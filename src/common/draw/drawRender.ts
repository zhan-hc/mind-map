import type { RaphaelPaper, RaphaelElement, RaphaelReadAttributes, RaphaelSet } from 'raphael';
import { changeIconDisabled, forTreeEvent, getCenterXY } from '../../utils/common'
import { getNodeCenterPosition, getNodeIconPosition,  getNodeLevel,  getNodeRectAttr, getNodeRectBorder, getNodeRectInfo, getNodeTextAttr } from '../../utils/nodeUtils'
import { NodeWidthHeight, dragNodeInfo, iconList, textPadding } from '../../constant'
import Node, { shapeAttr } from '../node/node';
import { Paper } from '../paper';
import DrawGenerator, { rectData } from './drawGenerator';
import { DRAW_CALLBACK_TYPE, ExtraOption, OPERATE_STATUS } from './type';
import { Viewport } from '../viewport';
import Position, { connectPositionOption, insertAreaOption } from '../position';
import { NodeLevel, NodeTypeId } from '../node/helper';
import { CLICK_RECT_BORDER, DEFAULT_LINE_WIDTH, DRAG_PLACEHOLDER_LINE, DRAG_PLACEHOLDER_RECT, DRAG_START_CUR_RECT, HOVER_RECT_BORDER, NONE_BORDER } from '../../constant/attr';
import EditTopic from '../operate/editTopic';
import { Ref, reactive, ref } from 'vue';
import Tree from '../tree';
export interface Option extends ExtraOption {
  tree: Tree | null
}
interface renderData {
  checkNodeList: Array<Node> // 选中的边框
}
export class DrawRender {
  private readonly paper: RaphaelPaper;
  private readonly drawGenerator: DrawGenerator;
  public viewport: Viewport;
  public data: renderData;
  private tree: Tree | null | undefined; // 树节点
  private dragInsertEle: RaphaelSet | null; // 拖拽可插入的区域显示
  private editTopic: EditTopic | null; // 编辑
  private operateStatus: Ref<string>; // 操作状态
  public constructor(paper: Paper, option: Option) {
    this.paper = paper.getPaper()
    this.drawGenerator = paper.getDrawGenertator()
    this.operateStatus = ref('')
    this.dragInsertEle = null
    this.editTopic = null
    this.tree = option.tree
    this.data = reactive({ checkNodeList: [] })
    this.viewport = new Viewport(paper, {
      ratio: option?.ratio || ref(0), 
      operateStatus: this.operateStatus, 
      cb: {
        checkBoxEvent: this.checkBoxEvent.bind(this), // 获取选中框里的node节点
        clearClickStatus: this.clearClickStatus.bind(this), // 清除选中状态
        setCheckNodeList: this.setCheckNodeList.bind(this) // 设置checkNodeList的值
      }
    })
    paper.getPaperElement().addEventListener('click', this.paperClick.bind(this))
    this.drawTopic = this.drawTopic.bind(this)
  }

  // 绘制节点
  public drawTopic (node:Node, checkNodeId: string, callback?: any) {
    const st = this.paper.set()
    // 矩形节点
    const rect = this.drawGenerator.drawRect(getNodeRectInfo(node, 5), getNodeRectAttr(node, 0) as RaphaelReadAttributes) // 底层节点
    st.push(rect)
    // 图片
    const hasImg = node.imageData && node.imageData.url
    if (hasImg) {
      const image = this.drawGenerator.drawImage(node.imageData, { x: node.attr.x + textPadding, y: node.attr.y + textPadding } )
      st.push(image)
    }

    // 文本
    const {x, y} = getNodeCenterPosition(node)
    const text = this.drawGenerator.drawText({ x: x + (hasImg ? (node.imageData.width * 0.5) : 0), y }, node.text, getNodeTextAttr(node) as RaphaelReadAttributes)
    st.push(text)

    // 节点连接线
    const line = this.drawLine(node)
    if (line) {
      st.push(line)
    }

    // 最顶层矩形主要用于hover和click
    const wrapRect = this.drawWrapRect(node, callback || null)
    st.push(wrapRect)

    if (node.id === NodeTypeId.root) {
      callback[node.id] = node
    }
    node.setShape(wrapRect)

    // 如果是新增节点则默认选中新节点
    if (node.id === checkNodeId) {
      node.shape.attr(CLICK_RECT_BORDER)
      this.data.checkNodeList = [node]
      changeIconDisabled(this.data.checkNodeList, iconList)
    }

    if (node.children && node.children.length) {
      // 绘制展开按钮
      const data = {
        key: 'node',
        value: node
      }
      const expandIcon = this.drawGenerator.drawExpandIcon(getNodeIconPosition(node), data, !node.expand)
      expandIcon.click(function () {
        const node = this.data(data.key)
        if (callback[DRAW_CALLBACK_TYPE.EXPAND]) {
          node.setExpand(!node.expand)
          callback[DRAW_CALLBACK_TYPE.EXPAND]()
        }
      })
      // 如果子节点展开
      if (node.expand) {
        node.children.forEach((item: Node) => this.drawTopic(item, checkNodeId, callback))
        
      }
    }
  }

  // 绘制最顶层的矩形节点(即悬浮可点击节点)
  public drawWrapRect (node: Node, cb?: any) {
    const that = this
    const data = {
      key: 'node',
      value: node
    }
    const wrapRect = this.drawGenerator.drawRect(getNodeRectBorder(node, 5, 4), getNodeRectAttr(node, 1) as RaphaelReadAttributes, data)
    // 点击事件
    wrapRect.click(function (e) {
      e.stopPropagation()
      // 移动至可视区域
      that.moveViewArea(this.node)
      // // 编辑的时候触发了点击则失焦
      if (that.editTopic?.editStatus) {
        that.editTopic.editInput?.blur()
      }
      that.changeCheckTopic(node)
    })
    // 拖拽事件
    if (cb && cb[DRAW_CALLBACK_TYPE.DRAG]) {
      const position = new Position()
      let insertArea: insertAreaOption | null = null;
      wrapRect.drag(
        function onmove (x, y, cx, cy, e) {
          that.setDragStatus(OPERATE_STATUS.DRAG)
          const node = this.data('node')
          if (node.id === NodeTypeId.root) {
            return
          }
          // 拖拽的节点设置红色虚线框
          node.shape.attr(DRAG_START_CUR_RECT);
          const list = position.getNodeInsertArea(cb[NodeTypeId.root], [], node)
          // 拖拽的时候生成可插入区域
          // list.forEach((item:any) => {
          //   const aa = that.drawGenerator.drawRect({x: item.area.x,y:item.area.y,width: item.area.x2 - item.area.x, height: item.area.y2-item.area.y,radius: 0}, {fill: '#fff8dc'} as any)
          //   aa.toBack()
          // })

          const dragId = that.dragInsertEle && that.dragInsertEle.data('dragId')
          // 获取拖拽鼠标坐标所在的插入区域
          for (let i = 0;i<list.length;i++) {
            if (cx > list[i].area.x && cy > list[i].area.y && cx <= list[i].area.x2 && cy <= list[i].area.y2) {
              insertArea = list[i]
              break;
            }
          }
          // 如果拖拽区域与上次是同个区域
          if (that.dragInsertEle && dragId === insertArea?.id) {
            return
          }
          if (insertArea) {
            that.dragInsertEle?.remove()
            that.dragInsertEle = that.drawDragRect(insertArea, {key: 'dragId', value: insertArea.id})
          }
        },
        function onstart (x,y,e) {
          const node = this.data('node')
          // 编辑的时候触发了点击则失焦
          if (that.editTopic?.editStatus) {
            that.editTopic.editInput?.blur()
          }
          that.changeCheckTopic(node)
        },
        function onend (e) {
          that.setDragStatus(OPERATE_STATUS.NULL)
          const dragId = that.dragInsertEle && that.dragInsertEle.data('dragId')
          if (that.dragInsertEle && dragId === insertArea?.id) {
            return
          }
          that.dragInsertEle?.remove()
          const node = this.data('node')
          node.shape.attr(NONE_BORDER)
          if (insertArea) {
            // 删除该节点
            node.father.removeChild(node)
            // 对其父节点的子节点sort重新设值
            node.father.sortChild()
            // 拖拽的节点更改父节点
            node.setFather(insertArea.father)
            // 拖拽的节点更改节点sort
            node.setSort(insertArea.insertIndex)
            // 拖拽的节点更改属性
            node.setAttr({
              ...node.attr,
              width: NodeWidthHeight[getNodeLevel(node)].width,
              height: NodeWidthHeight[getNodeLevel(node)].height,
              lineStartX: null,
              lineStartY: null
            })
            // 给node的插入的父节点插入node
            insertArea.father.pushChild(node)
            // 并重新排序
            insertArea.father.insertSortChild(node)
            cb[DRAW_CALLBACK_TYPE.DRAG]()
            insertArea = null
          }
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
    const st = this.paper.set()
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
  public drawLine (node: any, attr?: RaphaelReadAttributes) {
    const pNode = node.father
    if (!pNode) return
    // 节点的中心坐标
    const centerPosition = {
      x: pNode.attr.x +  0.5 * pNode.attr.width,
      y: pNode.attr.y + 0.5 * pNode.attr.height
    }
    let linePath = '';
    // 绘制当前节点的链接线
    if (getNodeLevel(node) === NodeLevel.second) { // 第一层节点
      const endPosition = {
        x: node.attr.x +  0.5 * node.attr.width,
        y: node.attr.y + 0.5 * node.attr.height
      }
      linePath = this.drawGenerator.drawFirstLine(centerPosition, endPosition)
    } else {
      // 如果父节点有起始坐标则使用否则用默认坐标
      const startPosition = {
        x: pNode.attr.lineStartX ? pNode.attr.lineStartX : (pNode.attr.x + pNode.attr.width),
        y: pNode.attr.lineStartY ? pNode.attr.lineStartY : (centerPosition.y)
      }
      // 下次该子节点有子节点的时候其连接线的起始位置为节点矩形的右下角
      node.setAttr && node.setAttr({
        ...node.attr,
        lineStartX: node.attr.x + node.attr.width,
        lineStartY: node.attr.y + node.attr.height
      })
      const endPosition = {
        leftX: node.attr.x,
        leftY: node.attr.y + node.attr.height ,
        rightX: node.attr.lineStartX,
        rightY: node.attr.lineStartY
      } as connectPositionOption
      linePath = this.drawGenerator.drawChildLine(startPosition, endPosition)
    }
    const drawAttr = attr ?? DEFAULT_LINE_WIDTH as RaphaelReadAttributes
    const line = this.drawGenerator.drawLine(linePath, drawAttr)
    line.toBack()
    return line
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

  // 改变选中的节点
  public changeCheckTopic(node: Node) {
    this.data.checkNodeList.forEach(item => item.shape.attr(NONE_BORDER))
    this.data.checkNodeList = [node]
    // 更新操作栏的图标状态
    changeIconDisabled(this.data.checkNodeList, iconList)
    // 选中当前节点
    node.shape.attr(CLICK_RECT_BORDER)
  }

  public setEditTopic (edit: EditTopic) {
    this.editTopic = edit
  }

  public setDragStatus (val: string) {
    this.operateStatus.value = val
  }

  public setCheckNodeList (val: Array<Node>) {
    this.data.checkNodeList = val
  }

  public paperClick (e: Event) {
    e.preventDefault()
    changeIconDisabled(null, iconList)
    this.data.checkNodeList.forEach(item => item.shape.attr(NONE_BORDER))
  }
  // 移动至可视区域
  public moveViewArea (node: SVGRectElement | Element) {
    // // 当元素被遮挡时，让其完全出现可视区域
    // const { top, left, right, bottom } = node.getBoundingClientRect()
    // let moveX = this.viewport.getScaleOption().x;
    // let moveY = this.viewport.getScaleOption().y;
    // const event = [(val: number) => (moveY += val), (val: number) => (moveX += val), (val: number) => (moveX -= val), (val: number) => (moveY -= val)];
    // [top, left, right, bottom].forEach((item, i) => (item < 0 &&  event[i](item)))
    // this.paper.setViewBox(moveX, moveY, this.viewport.getScaleOption().w, this.viewport.getScaleOption().h, false);
  }

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

  public clearClickStatus () {
    this.data.checkNodeList.forEach(item => item.shape.attr(NONE_BORDER));
    changeIconDisabled(null, iconList)
  }

  public clear(): void {
    this.paper.clear();
  }
}