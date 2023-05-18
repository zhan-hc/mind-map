<script setup lang="ts">
import { toRefs } from 'vue'
import { operateOption } from '../utils/type'

const props = defineProps({
  iconList: {
    type: Array<operateOption>,
    default: () => []
  }
})

const split = [1, 4]
const { iconList }  = toRefs(props)
const emit  = defineEmits(['handleOperate'])

function handleOperate (item: operateOption): void {
  if (!item.disabled) {
    emit('handleOperate', item.type)
  }
}
</script>

<template>
  <div class="wrap">
    <div class="operate-main" v-for="(item, i) in iconList" :key="i" >
      <div class="operate-item" :class="[item.icon, item.disabled ? 'disabled' : '']" @click="handleOperate(item)"></div>
      <div v-if="split.includes(i)" class="split-line"></div>
    </div>
  </div>
  
</template>

<style scoped>
.wrap {
  z-index: 999;
  position: fixed;
  top: 20px;
  left: 50%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 50px;
  width: 300px;
  padding: 0 20px;
  background: #fff;
  transform: translateX(-50%);
  border-radius: 5px;
  box-sizing: border-box;
  box-shadow: 0 0 10px #0000000d, inset 0 0 1px #0003, 0 12px 40px #0000001a;
}
.operate-main {
  position: relative;
  display: flex;
  align-items: center;
}
.split-line {
  position: absolute;
  right: -10px;
  top: 50%;
  transform: translateY(-50%);
  width: 2px;
  height: 20px;
  background-color: #ccc;
}
.operate-item {
  position: relative;
  width: 25px;
  height: 25px;
}
.operate-item:hover {
  cursor: pointer;
}
.disabled {
  opacity: .3;
  cursor: default !important;
}
</style>