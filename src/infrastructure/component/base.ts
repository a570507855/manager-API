export abstract class ComponentBase {
  public async release(): Promise<void> {}

  public abstract async load(): Promise<void>;
}
