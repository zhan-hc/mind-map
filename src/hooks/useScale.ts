import { ref } from 'vue'
import { ViewPort } from '../common/paper/viewport'
export default function () {
  const ratio = ref(100)

  function changeRatio (type: 1|0, viewPort: ViewPort) {
    const coef = viewPort.getScaleOption().coef
    const maxSize = viewPort.getScaleMaxSize() * 100
    const minSize = viewPort.getScaleMinSize() * 100
    if (type) {
      viewPort.onScale(120)
      const newRatio = (ratio.value + coef * 100)
      ratio.value = newRatio > maxSize ? maxSize: newRatio
    } else {
      viewPort.onScale(-120)
      const newRatio = (ratio.value - coef * 100)
      ratio.value = newRatio < minSize ? minSize: newRatio
    }
  }

  return {
    ratio,
    changeRatio
  }
}