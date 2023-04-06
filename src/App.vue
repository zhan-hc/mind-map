<script setup lang="ts">
import { reactive, watch } from 'vue';
import { createNode } from './common/node'
import { flatNodes } from './constant/'
import { Tree, TreeOption } from './common/tree'
import { Paper } from './common/paper';
import position from './common/position'
import { operateType, operateOption } from './utils/type'
import { onMounted, watchEffect } from 'vue';
import useOperate from './hooks/useOperate'
import operate from './components/operate.vue'
import Position from './common/position';
import { NodeType } from './common/node/helper';
import { iconList } from './constant'

  let tree: Tree | null = null
  let paper: Paper | null = null
  let show = false

  function initPaper () {
    tree = new Tree(flatNodes)
    paper = new Paper('#paper')
    reDraw()
  }

  function reDraw (newNodeId = '') {
    paper?.clear()
    const lineList = flatNodes.map(item => item.line) as string[]
    paper?.drawLine(lineList)
    tree && paper?.drawTopic(tree.treeNodes, newNodeId)
    paper?.drawText(flatNodes)
  }

  function handleOperate (type: operateType) {
    if ([operateType.addTopic, operateType.addSubTopic].includes(type)) {
      const position = new Position()
      const newNode = createNode(paper?.checkNode as TreeOption, type)
      flatNodes.push(newNode)
      // 重新对当前节点的sort属性排序
      tree?.sortNodes(newNode, type)
      // 对节点重新计算位置
      position.getNodePosition(flatNodes[0])
      tree?.convertToTree(flatNodes)
      // 重绘
      reDraw(newNode.id)
    }
    
  }

  onMounted(() => {
    initPaper()
  })


</script>

<template>
  <operate @operate="handleOperate" :iconList="iconList"/>
  <div id="paper" style="width:100vh;height:100vh;"></div>
</template>

<style scoped>
</style>
