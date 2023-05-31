<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { ElColorPicker } from 'element-plus'
import { NodeLevel } from '../common/node/helper';
import { NodeInfo } from '../common/node/helper';
import {predefineColors} from '../constant/color'
import { lineOption, styleType } from '../constant/operate';

const props = defineProps({
  lineList: {
    type: Array<lineOption>,
    default: () => []
  }
})

const emit = defineEmits(['changeColor', 'handleCommand'])

const topicList = reactive([
  {
    label: '根节点',
    value: NodeLevel.first,
    borderColor: ref('rgba(0,0,0,0)'),
    fillColor: ref(NodeInfo[NodeLevel.first].fillColor),
    fontColor: ref(NodeInfo[NodeLevel.first].fontColor)
  },
  {
    label: '次节点',
    value: NodeLevel.second,
    borderColor: ref('rgba(0,0,0,0)'),
    fillColor: ref(NodeInfo[NodeLevel.second].fillColor),
    fontColor: ref(NodeInfo[NodeLevel.second].fontColor)
  },
  {
    label: '其他节点',
    value: NodeLevel.others,
    borderColor: ref('rgba(0,0,0,0)'),
    fillColor: ref(NodeInfo[NodeLevel.others].fillColor),
    fontColor: ref(NodeInfo[NodeLevel.others].fontColor)
  }
])

const LINE_COLOR = ref('#000000')
const checkLine = computed(() => props.lineList.find(item => item.checked))
const changeColor = (color:string | null, level:string, colorKey:string) => {
  emit('handleCommand', { type: level, value: color, key: colorKey })
}

const changeLine = (color:string | null) => {
  emit('handleCommand', { type: styleType.lineColor, value: color, key: '' })
}

function handleCommand ( value: number, type: number, key: string = '') {
  emit('handleCommand', { value, type, key })
}
</script>

<template>
  <div class="color-wrap">
    <div class="color-attr">
      <div class="one-item"></div>
      <div class="attr-item">边框</div>
      <div class="attr-item">背景</div>
      <div class="attr-item">字体</div>
    </div>
    <div class="color-obj" v-for="item in topicList" :key="item.value">
      <div class="one-item">{{item.label}}</div>
      <div class="attr-item"><el-color-picker v-model="item.borderColor" show-alpha :predefine="predefineColors" @change="changeColor($event, item.value, 'borderColor')"/></div>
      <div class="attr-item"><el-color-picker v-model="item.fillColor" show-alpha :predefine="predefineColors"  @change="changeColor($event, item.value, 'fillColor')"/></div>
      <div class="attr-item"><el-color-picker v-model="item.fontColor" show-alpha :predefine="predefineColors"  @change="changeColor($event, item.value, 'fontColor')"/></div>
    </div>
    <div class="split-line"></div>
    <div class="line">
      <div class="line-label">连接线</div>
      <div class="line-color"><el-color-picker v-model="LINE_COLOR" show-alpha :predefine="predefineColors" @change="changeLine($event)"/></div>
      <div class="line-type">
        <el-dropdown>
          <div class="line-item" :class="checkLine?.icon"></div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item v-for="(item, i) in lineList" :key="i">
                <el-tooltip
                  effect="dark"
                  :content="item.desc"
                  placement="right"
                >
                  <div class="line-item" :class="[item.icon, item.checked ? 'checked' : '']" @click="handleCommand(item.value, styleType.line)"></div>
                </el-tooltip>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<style scoped>
.color-wrap {
  z-index: 99;
  position: fixed;
  left: 20px;
  top: 20px;
  display: flex;
  flex-direction: column;
  width: 260px;
  padding: 15px;
  background: #fff;
  border-radius: 5px;
  box-sizing: border-box;
  box-shadow: 0 0 10px #0000000d, inset 0 0 1px #0003, 0 12px 40px #0000001a;
}
.color-attr {
  display: flex;
  margin-bottom: 20px;
  justify-content: space-around;
}
.attr-item {
  flex: 1;
  text-align: center;
}
.color-obj {
  display: flex;
  justify-content: space-around;
  margin-bottom: 10px;
}
.one-item {
  width: 80px;
}
.input-color {
  width: auto;
}

.split-line {
  width: 100%;
  height: 2px;
  margin-bottom: 10px;
  background-color: #ccc;
}

.line {
  display: flex;
  align-items: center;
}
.line-label {
  width: 80px;
  margin-right: 8px;
}

.line-type {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  margin-left: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  cursor: pointer;
  box-sizing: border-box;
}

.line-item {
  position: relative;
  width: 20px;
  height: 20px;
  color: #000;
}
</style>