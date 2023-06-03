import type { RaphaelSet } from 'raphael';
import { getNodeIconPosition } from '../../utils/nodeUtils';
import Node from './node';
import { getRectData } from '../../utils/common';
import DrawGenerator from '../draw/drawGenerator';
import { DRAW_CALLBACK_TYPE } from '../draw/type';

export class NodeExpand {
  private readonly drawGenerator: DrawGenerator;
  private node : Node;
  public expandIcon: RaphaelSet<"SVG" | "VML">
  public constructor(drawGenerator: DrawGenerator, node: Node) {
    this.drawGenerator = drawGenerator
    this.node = node
    this.expandIcon = this.drawGenerator.drawExpandIcon(getNodeIconPosition(node), getRectData(node), !node.expand)
  }

  public expandIconClick (cb: any) {
    this.expandIcon.click(function () {
      const node = this.data('node')
      if (cb[DRAW_CALLBACK_TYPE.EXPAND]) {
        node.setExpand(!node.expand)
        cb[DRAW_CALLBACK_TYPE.EXPAND]()
      }
    })
  }
}