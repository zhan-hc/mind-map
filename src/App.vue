<script setup lang="ts">
import { operateTotalType, operateType } from './utils/type'
import { onMounted } from 'vue';
import operate from './components/operate.vue'
import { iconList } from './constant'
import useOperate from './hooks/useOperate';
import useDraw from './hooks/useDraw';

  const callbackObject: any = {}

  const { handleOperate, addEditToBlur } = useOperate()
  const { drawRender, reDraw } = useDraw()

  // 节点操作点击事件
  function handleOperateFunc (type: operateType) {
    callbackObject[operateTotalType.add] = (id: string) => {
      reDraw(id)
    }
    handleOperate(drawRender, type, callbackObject)
  }

  // 节点编辑失焦事件
  function handleEditBlur () {
    addEditToBlur(drawRender, () => reDraw())
  }

  onMounted(() => {
    handleEditBlur()
  })


</script>

<template>
  <operate @operate="handleOperateFunc" :iconList="iconList"/>
  <div id="paper" style="width:100vw;height:100vh;">
    <div class="node-edit-wrap">
      <div class="node-text" contenteditable="true">zzzzzz</div>
    </div>
  </div>
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
  /* width: 200px;
  height: 100px; */
}
</style>
