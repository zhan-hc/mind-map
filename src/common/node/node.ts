import { randomId } from '../../utils/common'
import { getNodeLevel } from '../../utils/nodeUtils'
import { operateType } from '../../utils/type'
import { NodeWidthHeight } from '../../constant';
import type { RaphaelElement } from 'raphael';
import { NodeLevel, NodeTypeId } from './helper';

export interface shapeAttr {
  x: number;
  y: number;
  width: number;
  height: number;
  lineStartX?: number;
  lineStartY?: number
}
export interface NodeOptions {
  id: string;
  father: Node | null;
  text: string;
  attr: shapeAttr;
  sort: number;
  expand: boolean;
  shape?: RaphaelElement
}

class Node {
  private readonly _id: string;
  private _text: string;
  private _attr: shapeAttr;
  private _expand: boolean;
  private _father: Node | null;
  private _sort: number;
  private _shape: RaphaelElement;
  private _children: Node[];
  public constructor ({
    id,
    text,
    father,
    attr,
    sort,
    expand,
    shape
  }: NodeOptions) {
    this._id = id
    this._attr = attr
    this._sort = sort
    this._text = text
    this._expand = expand
    this._shape = shape as RaphaelElement
    this._children = []
    this._father = father
  }

  public get id() { return this._id; }
  public get father() { return this._father; }
  public get text() { return this._text; }
  public get attr() { return this._attr; }
  public get sort() { return this._sort; }
  public get expand() { return this._expand; }
  public get children() { return this._children; }


  public clearChild(): void {
    this._children = [];
  }

  public pushChild(child: Node): void {
    this._children.push(child);
  }

  public insertAfterChild(relativeChild: Node, child: Node): void {
    const relativeIndex = this.children.findIndex((itemChild) => itemChild.id === relativeChild.id);
    if (relativeIndex > -1) {
      this.children.splice(relativeIndex + 1, 0, child);
    }
  }

  public removeChild(child: Node): void {
    const relativeIndex = this.children.findIndex((itemChild) => itemChild.id === child.id);
    if (relativeIndex > -1) {
      this.children.splice(relativeIndex, 1);
    }
  }

  public isRoot(): boolean {
    return this.id === null;
  }
  public getBBox () {
    return this._shape.getBBox()
  }

  public setText (text: string) {
    this._text = text
  }
  public setShape (shape: RaphaelElement) {
    this._shape = shape
  }
  public setSort (index: number) {
    this._sort = index
  }
  public setExpand (val: boolean) {
    this._expand = val
  }
  public setAttr (attr: shapeAttr) {
    this._attr = attr
  }
}


export function createNode (data: NodeOptions): Node {
  return new Node(data)
}

export function getInitData () {
  const attr = {
    x: 100,
    y: 500,
    width: NodeWidthHeight['first'].width,
    height: NodeWidthHeight['first'].height
  }

  const node = {
    id: NodeTypeId.root,
    father: null,
    text: 'My Root',
    attr,
    sort:  0,
    expand: true
  }
  return node
}

export function getChildNodeData (type: operateType, checkNode: Node) {
  const pid = checkNode.father?.id
  const nodeLevel = (!pid || pid === NodeTypeId.root) ? NodeLevel.second : NodeLevel.others
  const attr = {
    x: 0,
    y: 0,
    width: NodeWidthHeight[nodeLevel].width,
    height: NodeWidthHeight[nodeLevel].height
  }

  const node = {
    id: randomId(),
    father: type === operateType.addTopic ? checkNode.father : checkNode,
    text: 'My Child',
    attr,
    sort: type === operateType.addTopic ? (checkNode.sort + 1) : checkNode.children.length,
    expand: true
  }
  return node
}

export default Node;