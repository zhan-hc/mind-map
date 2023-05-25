<script setup lang="ts">
import { onMounted } from 'vue';
import operate from './components/operate.vue';
import scale from './components/scale.vue';
import useDraw from './hooks/useDraw';
import useScale from './hooks/useScale';
import { lineList, operateList } from './constant/operate';
import { Viewport } from './common/viewport'

  const { drawRender, initPaper, handleEditBlur, handleOperateFunc, handleCommand } = useDraw()
  const { ratio, changeRatio } = useScale()


  // 缩放
  function handleZoomFunc (type: 0|1) {
    changeRatio(type, drawRender.value?.viewport as Viewport)
  }

  onMounted(() => {
    initPaper({
      ratio
    })
  })


</script>

<template>
  <operate :operateList="operateList" :lineList="lineList" @handleOperate="handleOperateFunc" @handleCommand="handleCommand"></operate>
  <div id="paper" style="width:100vw;height:100vh;">
    <div class="edit-wrap">
      <div class="edit-text" contenteditable="true" @blur="handleEditBlur"></div>
    </div>
  </div>
  <scale :ratio="ratio" @handleZoom="handleZoomFunc"></scale>
</template>

<style scoped>
.edit-wrap {
  z-index: 999;
  display: none;
  position: absolute;
  top: 1500px;
  left: 100px;
  max-width: 200px;
  background-color: #fff;
}
.edit-text {
  padding: 5px 10px;
  font-size: 16px;
  background-color: #fff;
}
</style>
