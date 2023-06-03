import { operateTotalType, operateType } from "../../constant/operate";
import Node from "../node/node";
import { Command } from "./type";

export default class AddCommand implements Command{
  public type: string;
  public lastCheckNodeIds: string[]
  constructor(public node: Node, public checkNode: Node, public addType: number) {
    this.type = operateTotalType.ADD
    this.lastCheckNodeIds = [checkNode.id]
  }

  execute() {
    (this.addType === operateType.addTopic) && this.checkNode.father?.insertAfterChild(this.checkNode, this.node);
    (this.addType === operateType.addSubTopic) && this.checkNode.pushChild(this.node);
  }

  undo () {
    this.node.father?.removeChild(this.node)
  }
}