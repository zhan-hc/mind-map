
import { operateType } from '../utils/type'
import { iconList } from '../constant'
export default function () {

  const changeDisable = (type: operateType, value: boolean) => {
    iconList.forEach(item => {
      if (item.type === type) {
        item.disabled = value
      }
    })
  }

  return {
    changeDisable
  }
}