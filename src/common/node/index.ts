import { getNodeLevel, randomId } from '../../utils/common'
import { operateType } from '../../utils/type'
import { NodeWidthHeight, flatNodes } from '../../constant';
import { positionOption } from '../position'
export interface NodeOptions {
  id: string;
  text: string;
  x: number;
  y: number;
  parentId: string | null,
  width: number,
  height: number,
  sort: number,
  line?: string,
  nextStartPosition? : positionOption
}

export function createNode (checkNode: NodeOptions, type: operateType)  {
  const newNode : NodeOptions = {
    id: randomId(),
    text: 'My Child',
    parentId: type === operateType.addTopic ? checkNode.parentId : checkNode.id,
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    sort: type === operateType.addTopic ? (checkNode.sort + 1) : flatNodes.filter(item => item.parentId === checkNode.id).length
  }

  newNode.width = NodeWidthHeight[getNodeLevel(newNode)].width
  newNode.height = NodeWidthHeight[getNodeLevel(newNode)].height
  return newNode
}

class Node {
  private readonly _id: string
  private readonly _text: string
  private readonly _sort: number
  public constructor ({
    id,
    text,
    x,
    y,
    parentId,
    width,
    height,
    sort
  }: NodeOptions) {
    this._id = id
    this._text = text
    this._sort = sort
  }

  public isRoot(node: NodeOptions): boolean {
    return node.parentId === null;
  }
}

export default Node;