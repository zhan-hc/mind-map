<script setup lang="ts">
import { contactIcon } from "../utils/unocss-icon";
import { onMounted } from "vue";
import { ElMessage } from 'element-plus'
import { useClipboard } from '@vueuse/core'
const iconType = ['wechat', 'github']
const wechat = 'HC--ZHAN'
const { isSupported, copy } = useClipboard()
const handleClick = (i: number) => {
  if (isSupported && iconType[i] === 'wechat') {
    copy(wechat)
    ElMessage.success({ message: '复制微信号成功' })
  } else if (iconType[i] === 'github') {
    window.open('https://www.github.com/zhan-hc/mind-map')
  }
}

onMounted(() => {
})
</script>

<template>
  <div class="contact-wrap">
    <div
      class="icon"
      :key="icon"
      v-for="(icon, i) in contactIcon"
      :class="[icon, icon === 'wechat' ? 'copy-icon' : '']"
      @click="handleClick(i)"
    ></div>
  </div>
</template>

<style scoped>
.contact-wrap {
  z-index: 99;
  position: fixed;
  top: 20px;
  right: 20px;
  display: flex;
  padding: 10px 15px;
  font-size: 20px;
  background: #fff;
  border-radius: 5px;
  box-sizing: border-box;
  box-shadow: 0 0 10px #0000000d, inset 0 0 1px #0003, 0 12px 40px #0000001a;
}
.icon {
  margin-right: 10px;
}
.icon:hover {
  cursor: pointer;
}
.icon:last-child {
  margin-right: 0;
}
</style>