<script setup lang="ts">
import { onMounted, ref } from 'vue';
import operate from './components/operate.vue';
import scale from './components/scale.vue';
import color from './components/color.vue'
import contact from './components/contact.vue'
import useDraw from './hooks/useDraw';
import useScale from './hooks/useScale';
import { lineList, operateList } from './constant/operate';
import { Viewport } from './common/viewport'
import { isMobile } from './utils/common';

  const { drawRender, initPaper, handleEditBlur, handleOperateFunc, handleCommand, reDraw } = useDraw()
  const { ratio, changeRatio } = useScale()
  const colorStatus = ref(false)


  // 缩放
  function handleZoomFunc (type: 0|1) {
    changeRatio(type, drawRender.value?.viewport as Viewport)
  }

  onMounted(() => {
    initPaper({
      ratio
    })
    // 父组件数据初始化完之后再渲染color组件，否则会因为渲染顺序问题导致color显示的是默认数据
    colorStatus.value = true
  })


</script>

<template>
  <operate :operateList="operateList" :lineList="lineList" @handleOperate="handleOperateFunc"></operate>
  <color v-if="!isMobile && colorStatus" :lineList="lineList" @handleCommand="handleCommand"/>
  <div id="paper" style="width:100vw;height:100vh;">
    <div class="edit-wrap">
      <div class="edit-text" contenteditable="true" @blur="handleEditBlur"></div>
    </div>
  </div>
  <scale :ratio="ratio" @handleZoom="handleZoomFunc"></scale>
  <contact  v-if="!isMobile" />
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
