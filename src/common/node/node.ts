import { randomId } from '../../utils/common'
import { operateType } from '../../constant/operate'
import type { RaphaelElement } from 'raphael';
import { NodeInfo, NodeLevel, NodeTypeId } from './helper';

export interface shapeAttr {
  x: number;
  y: number;
  width: number;
  height: number;
}
export interface NodeOptions {
  id: string;
  father: Node | null;
  text: string;
  attr: shapeAttr;
  sort: number;
  expand: boolean;
  shape?: RaphaelElement;
  imageData?: ImageData
}

export interface dragAreaOption {
  id: string;
  father: Node;
  attr: shapeAttr;
}

export interface ImageData {
  url: string;
  width: number;
  height: number;
  file: File
}

class Node {
  private readonly _id: string;
  private _text: string;
  private _attr: shapeAttr;
  private _expand: boolean;
  private _father: Node | null;
  private _sort: number;
  private _shape: RaphaelElement;
  private _imageData: ImageData | undefined;
  private _children: Node[];
  public constructor ({
    id,
    text,
    father,
    attr,
    sort,
    expand,
    shape,
    imageData
  }: NodeOptions) {
    this._id = id
    this._attr = attr
    this._sort = sort
    this._text = text
    this._expand = expand
    this._shape = shape as RaphaelElement
    this._children = []
    this._father = father
    this._imageData = imageData
  }

  public get id() { return this._id; }
  public get father() { return this._father; }
  public get text() { return this._text; }
  public get attr() { return this._attr; }
  public get sort() { return this._sort; }
  public get expand() { return this._expand; }
  public get shape() { return this._shape }
  public get children() { return this._children; }
  public get imageData() { return this._imageData; }


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

  public sortChild (): void {
    this.children.forEach((item, i) => {
      item.setSort(i)
    })
  }

  public insertSortChild(child: Node): void {
    const sort = child.sort
    this.children.forEach(item => {
      if (item.id !== child.id) {
        item.setSort(item.sort >= sort ? (item.sort + 1) : item.sort)
      }
    })
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
  public setFather (node: Node | null) {
    this._father = node
  }
  public setImageData (imageData: ImageData | undefined) {
    this._imageData = imageData
  }
}


export function createNode (data: NodeOptions): Node {
  return new Node(data)
}

export function getInitData () {
  const attr = {
    x: 100,
    y: 500,
    width: NodeInfo['first'].attr.width,
    height: NodeInfo['first'].attr.height
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
  const nodeLevel = (!pid || (pid === NodeTypeId.root && type === operateType.addTopic)) ? NodeLevel.second : NodeLevel.others
  const attr = {
    x: 0,
    y: 0,
    width: NodeInfo[nodeLevel].attr.width,
    height: NodeInfo[nodeLevel].attr.height
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