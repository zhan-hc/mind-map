interface Command {
  execute(): void;
  undo(): void;
}