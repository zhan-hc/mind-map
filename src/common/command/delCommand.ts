import { operateTotalType } from "../../constant/operate";
import Node from "../node/node";

export default class DelCommand implements Command{
  public type: string;
  public lastCheckNodeIds: string[]
  constructor(public nodes: Node[]) {
    this.type = operateTotalType.DELETE
    this.lastCheckNodeIds = nodes.map(item => item.id)
  }

  execute() {
    this.nodes.forEach(node => {
      node.father?.removeChild(node)
    })
  }

  undo () {
    this.nodes.forEach(node => {
      node?.father?.insertAfterChild(node.father.children[node.sort - 1], node)
    })
  }
}