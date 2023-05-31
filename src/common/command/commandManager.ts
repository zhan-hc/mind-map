export default class CommandManager  {
  public executedCommands: any[]
  public fullCommands: any[]
  public curIndex: number; // 当前撤回索引
  constructor() {
    this.executedCommands = []
    this.fullCommands = []
    this.curIndex = -1
  }

  getExectedCommands () {
    return this.fullCommands[this.curIndex + 1]
  }

  pushCommand (command: any) {
    if (this.curIndex !== this.fullCommands.length - 1) {
      this.resetCommand()
    }
    this.executedCommands.push(command)
    this.fullCommands.push(command)
    this.curIndex += 1
  }

  pushUndoCommand (command: any) {
    this.executedCommands.push(command)
    this.curIndex += 1
  }

  resetCommand () {
    this.fullCommands = [...this.executedCommands]
    this.curIndex = this.executedCommands.length - 1
  }
  popCommand () {
    this.curIndex -= 1
    return this.executedCommands.pop()
  }

}
