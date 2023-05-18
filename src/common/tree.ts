import Node, { NodeOptions, createNode } from './node/node'
import Position from './position';
export class Tree {
  private root: Node;
  private readonly position: Position;
  constructor({
    data
  }: {
    data: NodeOptions
  })
  {
    this.root = createNode(data)
    this.position = new Position()
  }
  public getRoot(): Node {
    return this.root;
  }

  public setRoot (val: Node) {
    this.root = val
  }
}

export default Tree;