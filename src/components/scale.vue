<script setup lang="ts">
import { toRefs } from 'vue'
import { scaleIcons } from '../utils/unocss-icon';

const props = defineProps({
  ratio: {
    type: Number,
    default: () => 100
  }
})

const { ratio }  = toRefs(props)
const emit  = defineEmits(['handleZoom'])

function handleZoom (type: 1|0): void {
    emit('handleZoom', type)
}
</script>

<template>
  <div class="wrap">
    <div class="icon" :class="scaleIcons[1]" @click="handleZoom(0)"></div>
    <div>{{ratio}}%</div>
    <div class="icon" :class="scaleIcons[0]" @click="handleZoom(1)"></div>
  </div>
  
</template>

<style scoped>
.wrap {
  z-index: 999;
  position: fixed;
  bottom: 20px;
  right: 5%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 120px;
  height: 40px;
  padding: 0 10px;
  background: #fff;
  border-radius: 5px;
  box-shadow: 0 0 10px #0000000d, inset 0 0 1px #0003, 0 12px 40px #0000001a;
  box-sizing: border-box;
  font-size: 16px;
}
.icon {
  width: 16px;
  height: 16px;
}
</style>