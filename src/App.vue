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
  const { drawRender, reDraw } = useDraw()
  const { ratio, changeRatio } = useScale()

  // 节点操作点击事件
  function handleOperateFunc (type: operateType) {
    callbackObject[operateTotalType.ADD] = (id: string) => {
      reDraw(id)
    }
    callbackObject[operateTotalType.EDIT] = () => {
      editTopic?.editText(drawRender.value?.checkNode as Node)
    }

    callbackObject[operateTotalType.DELETE] = () => {
      reDraw()
    }
    handleOperate(drawRender, type, callbackObject)
  }

  // 节点编辑失焦事件
  function handleEditBlur () {
    console.log(editTopic, 'handleEditBlur')
    editTopic && (editTopic as EditTopic).addEventBlus(drawRender, () => reDraw())
  }

  // 缩放
  function handleZoomFunc (type: 0|1) {
    const viewPort = drawRender.value?.viewport as Viewport
    changeRatio(type, viewPort)
  }

  onMounted(() => {
    editTopic = new EditTopic({
      wrapName: '.edit-wrap',
      inputName: '.edit-text'
    })
    handleEditBlur()
  })


</script>

<template>
  <operate @handleOperate="handleOperateFunc" :iconList="iconList"></operate>
  <div id="paper" style="width:100vw;height:100vh;">
    <div class="edit-wrap">
      <div class="edit-text" contenteditable="true"></div>
    </div>
  </div>
  <scale :ratio="ratio" @handleZoom="handleZoomFunc"></scale>
</template>

<style scoped>
.edit-wrap {
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
