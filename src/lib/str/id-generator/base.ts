export abstract class IDGeneratorBase {
    public abstract async generate(): Promise<string>;
}
