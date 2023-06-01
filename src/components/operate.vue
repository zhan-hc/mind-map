<script setup lang="ts">
import { computed, toRefs } from 'vue'
import { imgType, lineOption, operateOption, operateType } from '../constant/operate'
import { ElDropdown } from 'element-plus'
import { ElTooltip } from 'element-plus'
const props = defineProps({
  operateList: {
    type: Array<operateOption>,
    default: () => []
  }
})

const { operateList }  = toRefs(props)
const emit  = defineEmits(['handleOperate', 'handleCommand'])

function handleOperate (item: operateOption, crud: number = 1): void {
  if (!item.disabled) {
    emit('handleOperate', item.type, crud)
  }
}
</script>

<template>
  <div class="operate-wrap">
    <div class="operate-main" v-for="(item, i) in operateList.slice(6)" :key="i">
      <el-tooltip
        effect="dark"
        :content="item.desc"
        :disabled="item.disabled"
        placement="bottom"
      >
        <div class="operate-item" :class="[item.icon, item.disabled ? 'disabled' : '']" @click="handleOperate(item)"></div>
      </el-tooltip>
    </div>
    <div class="split-line"></div>
    <div class="operate-main" v-for="(item, i) in operateList.slice(0, 2)" :key="i">
      <el-tooltip
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
        v-if="item.type !== operateType.operateImg"
        effect="dark"
        :content="item.desc"
        :disabled="item.disabled"
        placement="bottom"
      >
        <div class="operate-item" :class="[item.icon, item.disabled ? 'disabled' : '']" @click="handleOperate(item)"></div>
      </el-tooltip>
      <el-dropdown v-else>
        <div class="operate-item" :class="[item.icon, item.disabled ? 'disabled' : '']"></div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item :command="item" @click="handleOperate(item, imgType.add)">
              <el-tooltip
                effect="dark"
                content="添加图片"
                placement="right"
              >
              <img src="../assets/image/add_img.png" alt="">
              </el-tooltip>
            </el-dropdown-item>
            <el-dropdown-item :command="item" @click="handleOperate(item, imgType.delete)">
              <el-tooltip
                effect="dark"
                content="删除图片"
                placement="right"
              >
              <img src="../assets/image/del_img.png" alt="" >
              </el-tooltip>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

    </div>
    <div class="split-line"></div>
    <div class="operate-main" v-for="(item, i) in operateList.slice(5, 6)" :key="i">
      <el-tooltip
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
.operate-wrap {
  z-index: 999;
  position: fixed;
  top: 20px;
  left: 50%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 50px;
  width: 350px;
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
  width: 2px;
  height: 20px;
  background-color: #ccc;
}
.operate-item {
  position: relative;
  width: 25px;
  height: 25px;
  color: #000;
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