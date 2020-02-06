export default class PluginOutputHook<T> {
  constructor(private readonly name: string) {}

  get T(): T {
    throw new Error('use typeof instead');
  }

  toString() {
    return `pluginOutput{${this.name}}`;
  }
}
