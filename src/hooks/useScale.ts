import { ref } from 'vue'
import { Viewport } from '../common/viewport'
export default function () {
  const ratio = ref(100)

  function changeRatio (type: 1|0, viewport: Viewport) {
    viewport.onScale(type ? 1 : -1)
    viewport.changeRatio(type)
  }

  return {
    ratio,
    changeRatio
  }
}