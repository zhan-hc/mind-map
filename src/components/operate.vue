<script setup lang="ts">
import { toRefs } from 'vue'
import { operateOption } from '../utils/type'

const props = defineProps({
  iconList: {
    type: Array<operateOption>,
    default: () => []
  }
})

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
    <div v-for="(item, i) in iconList" :key="i" class="operate-item" :class="[item.icon, item.disabled ? 'disabled' : '']" @click="handleOperate(item)">
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
  justify-content: space-between;
  align-items: center;
  height: 50px;
  width: 200px;
  padding: 0 20px;
  background: #fff;
  transform: translateX(-50%);
  border-radius: 5px;
  box-sizing: border-box;
  box-shadow: 0 0 10px #0000000d, inset 0 0 1px #0003, 0 12px 40px #0000001a;
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