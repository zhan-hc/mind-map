<script setup lang="ts">
import { operateTotalType, operateType } from './utils/type';
import { onMounted } from 'vue';
import operate from './components/operate.vue';
import scale from './components/scale.vue';
import useOperate from './hooks/useOperate';
import useDraw from './hooks/useDraw';
import useScale from './hooks/useScale';
import Node from './common/node/node';
import { iconList } from './constant';
import { Viewport } from './common/paper/viewport';
import EditTopic from './common/operate/editTopic';

  const callbackObject: any = {}
  let editTopic: EditTopic | null = null
  const { handleOperate } = useOperate()
  const { drawRender, initPaper, reDraw } = useDraw()
  const { ratio, changeRatio } = useScale()

  // 节点操作点击事件
  function handleOperateFunc (type: operateType) {
    callbackObject[operateTotalType.ADD] = (id: string) => {
      reDraw(id)
    }
    callbackObject[operateTotalType.EDIT] = () => {
      editTopic?.editText(drawRender.value?.checkNode as Node, ratio)
    }

    callbackObject[operateTotalType.DELETE] = () => {
      reDraw()
    }
    handleOperate(drawRender, type, callbackObject)
  }

  // 节点编辑失焦事件
  function handleEditBlur (e: Event) {
    editTopic && (editTopic as EditTopic).addEventBlus(e, drawRender, () => reDraw())
  }

  // 缩放
  function handleZoomFunc (type: 0|1) {
    changeRatio(type, drawRender.value?.viewport as Viewport)
  }

  onMounted(() => {
    initPaper({
      ratio
    })
    editTopic = new EditTopic({
      wrapName: '.edit-wrap',
      inputName: '.edit-text'
    })
    drawRender.value?.setEditTopic(editTopic)
  })


</script>

<template>
  <operate @handleOperate="handleOperateFunc" :iconList="iconList"></operate>
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
