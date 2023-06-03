import Node, { NodeOptions } from './node/node'
import Position from './position';
export class Tree {
  private root: Node;
  private readonly position: Position;
  private nodeIndex: Map<string, Node>;
  constructor({
    data
  }: {
    data: NodeOptions
  })
  {
    this.nodeIndex = new Map();
    this.root = this.createNode(data)
    this.position = new Position()
    
  }
  public getRoot(): Node {
    return this.root;
  }

  public setRoot (val: Node) {
    this.root = val
  }

  public createNode (data: NodeOptions): Node {
    const node = new Node(data)
    this.nodeIndex.set(node.id, node)
    return node
  }
  public getNodeById(id: string): Node | undefined {
    return this.nodeIndex.get(id);
  }
}

export default Tree;