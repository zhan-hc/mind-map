<script setup lang="ts">
import { operateTotalType, operateType } from './utils/type'
import { onMounted } from 'vue';
import operate from './components/operate.vue'
import scale from './components/scale.vue'
import useOperate from './hooks/useOperate';
import useDraw from './hooks/useDraw';
import useScale from './hooks/useScale';
import { flatNodes, iconList } from './constant'
import { TreeOption } from './common/tree';
import { deleteNodeLists, getFlatNodeIds } from './utils/nodeUtils';
import { ViewPort } from './common/paper/viewport';

  const callbackObject: any = {}

  const { handleOperate, addEditToBlur } = useOperate()
  const { drawRender, reDraw } = useDraw()
  const { ratio, changeRatio } = useScale()

  // 节点操作点击事件
  function handleOperateFunc (type: operateType) {
    callbackObject[operateTotalType.ADD] = (id: string) => {
      reDraw(id)
    }
    callbackObject[operateTotalType.DELETE] = () => {
      const checkNode = drawRender?.value?.checkNode as TreeOption
      deleteNodeLists(flatNodes, getFlatNodeIds(checkNode))
      reDraw()
    }
    handleOperate(drawRender, type, callbackObject)
  }

  // 节点编辑失焦事件
  function handleEditBlur () {
    addEditToBlur(drawRender, () => reDraw())
  }

  // 缩放
  function handleZoomFunc (type: 0|1) {
    const viewPort = drawRender.value?.viewPort as ViewPort
    changeRatio(type, viewPort)
  }

  onMounted(() => {
    handleEditBlur()
  })


</script>

<template>
  <operate @handleOperate="handleOperateFunc" :iconList="iconList"></operate>
  <div id="paper" style="width:100vw;height:100vh;">
    <div class="node-edit-wrap">
      <div class="node-text" contenteditable="true"></div>
    </div>
  </div>
  <scale :ratio="ratio" @handleZoom="handleZoomFunc"></scale>
</template>

<style scoped>
.node-edit-wrap {
  display: none;
  position: absolute;
  top: 1500px;
  left: 100px;
  max-width: 200px;
  background-color: #fff;
}
.node-text {
  padding: 5px 10px;
  font-size: 16px;
  background-color: #fff;
}
</style>
