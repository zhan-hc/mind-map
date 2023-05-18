import Node from '../common/node/node'
import { NodeInfo, NodeTypeId } from '../common/node/helper'
import { getNodeLevel } from './nodeUtils';
import { operateOption, operateType } from './type'


// 生成随机id
export function randomId() {
  return (Math.random() + new Date().getTime()).toString(32).slice(0,8)
}

// 获取文本宽度
export function getTextWidth(node: Node, str = '') {
  const dom = document.createElement('span');
  const App = document.getElementById('app')
  dom.style.display = 'inline-block';
  dom.style.fontSize = NodeInfo[getNodeLevel(node)].fontSize + 'px'
  dom.textContent = str;
  App?.appendChild(dom);
  const width = dom.clientWidth;
  App?.removeChild(dom);
  return width;
}

// 改变操作icon的disabled属性
export function changeIconDisabled (checkNodes: Array<Node> | null, iconList: operateOption[]) {
  if (checkNodes && !checkNodes.length) return
  // 当选中多个节点时
  if (checkNodes && checkNodes?.length > 1) {
    // 如果多选里面包含根阶段
    const haveRoot = checkNodes.some(item => item.id === NodeTypeId.root)
    iconList.forEach(item => {
      if (haveRoot) {
        item.disabled = true
      } else {
        item.disabled = (item.type === operateType.delTopic ? false : true)
      }
    })
    return
  }
  // 如果是根节点不能添加兄弟节点和删除节点
  if (checkNodes !== null && checkNodes[0].id === NodeTypeId.root) {
    iconList.forEach(item => {
      if (![operateType.addTopic, operateType.delTopic].includes(item.type)) {
        item.disabled = false
      } else {
        item.disabled = true
      }
    })
  } else if (checkNodes === null) {
    iconList.forEach(item => {
      if (item.type === operateType.saveData) {
        item.disabled = false
      } else {
        item.disabled = true
      }
    })
  } else {
    iconList.forEach(item => {
      item.disabled = false
    })
  }
}


// 获取assets静态资源
export function getAssetsFile (url: string) {
  return new URL(`../assets/${url}`, import.meta.url).href
}

// 获取节点的中心坐标
export function getCenterXY (x:number, y:number, x2:number, y2:number) {
  const width = x2 - x
  const height = y2 - y
  const cx = x + 0.5 * width
  const cy = y + 0.5 * height
  return {
    cx,
    cy
  }
}

// 树节点遍历事件
export function forTreeEvent (root: Node, cb: Function, pid?: string) {
  const len = root.children.length
  cb(root, pid)
  if (len) {
    root.children.forEach(item => {
      forTreeEvent(item, cb, root.id)
    })
  }
}

export const mobileCheck = function() {
  let check = false;
  // @ts-ignore
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};

export const isMobile = mobileCheck();

export const isWindows = (): boolean => {
  return navigator.platform.indexOf('Win') > -1
};

export const getRectData = (value: any, key = 'node') => {
  return {
    key,
    value
  }
}

export const getLocalStorage = (key: string) => {
  return localStorage.getItem(key)
}


