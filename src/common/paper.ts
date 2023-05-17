import Raphael from 'raphael'
import type { RaphaelPaper } from 'raphael';
import DrawGenerator from './draw/drawGenerator';
export class Paper {
  private readonly paper: RaphaelPaper;
  public readonly drawGenrtator: DrawGenerator;
  public readonly paperEle: HTMLElement;
  public readonly paperAttr: any;
  public constructor(container: string | Element) {
    this.paperEle = this.getElement(container)
    const [width, height] = [this.paperEle.clientWidth, this.paperEle.clientHeight]
    this.paper = new Raphael(this.paperEle, width, height);
    this.paperAttr = { width, height }
    this.drawGenrtator = new DrawGenerator(this.paper)
  }

  public getPaper(): RaphaelPaper {
    return this.paper;
  }

  public getDrawGenertator(): DrawGenerator {
    return this.drawGenrtator;
  }

  public getElement (container: string | Element) : HTMLElement {
    const containerDom = (typeof container === 'string' ? document.querySelector(container) : container) as HTMLElement
    if (!containerDom) {
      throw new Error(`${container} is not exist`);
    }
    if (containerDom.clientWidth === 0 || containerDom.clientHeight === 0) {
      throw new Error('The width or height of Container is not more than 0')
    }
    return containerDom
  }

  public getPaperElement () {
    return this.paperEle
  }

  public getPaperAttr () {
    return this.paperAttr
  }

  public clear(): void {
    this.paper.clear();
  }
}