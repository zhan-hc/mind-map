<script setup lang="ts">
import { computed, toRefs } from 'vue'
import { lineOption, operateOption } from '../constant/operate'
import { ElDropdown } from 'element-plus'
import { ElTooltip } from 'element-plus'
const props = defineProps({
  operateList: {
    type: Array<operateOption>,
    default: () => []
  },
  lineList: {
    type: Array<lineOption>,
    default: () => []
  }
})

const checkLine = computed(() => props.lineList.find(item => item.checked))

const { operateList }  = toRefs(props)
const emit  = defineEmits(['handleOperate', 'handleCommand'])

function handleOperate (item: operateOption): void {
  if (!item.disabled) {
    emit('handleOperate', item.type)
  }
}

function handleCommand (item:lineOption) {
  !item.checked && emit('handleCommand', item.value)
}
</script>

<template>
  <div class="wrap">
    <div class="operate-main" v-for="(item, i) in operateList.slice(0, 2)" :key="i">
      <el-tooltip
        class="box-item"
        effect="dark"
        :content="item.desc"
        :disabled="item.disabled"
        placement="bottom"
      >
        <div class="operate-item" :class="[item.icon, item.disabled ? 'disabled' : '']" @click="handleOperate(item)"></div>
      </el-tooltip>
    </div>
    <div class="split-line"></div>
    <div class="operate-main" v-for="(item, i) in operateList.slice(2, 5)" :key="i">
      <el-tooltip
        class="box-item"
        effect="dark"
        :content="item.desc"
        :disabled="item.disabled"
        placement="bottom"
      >
        <div class="operate-item" :class="[item.icon, item.disabled ? 'disabled' : '']" @click="handleOperate(item)"></div>
      </el-tooltip>
    </div>
    <div class="split-line"></div>
    <div class="operate-main">
      <el-dropdown @command="handleCommand">
        <div class="operate-item" :class="checkLine?.icon"></div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item v-for="(item, i) in lineList" :key="i" :command="item">
              <div class="line-item" :class="[item.icon, item.checked ? 'checked' : '']"></div>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <div class="split-line"></div>
    <div class="operate-main" v-for="(item, i) in operateList.slice(5)" :key="i">
      <el-tooltip
        class="box-item"
        effect="dark"
        :content="item.desc"
        :disabled="item.disabled"
        placement="bottom"
      >
        <div class="operate-item" :class="[item.icon, item.disabled ? 'disabled' : '']" @click="handleOperate(item)"></div>
      </el-tooltip>
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
  padding: 0 10px;
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
  /* position: absolute;
  right: -10px;
  top: 50%;
  transform: translateY(-50%); */
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

.checked {
  border: 1px solid #3498db !important;
}

.line-item {
  width: 20px;
  height: 20px;
}
</style>