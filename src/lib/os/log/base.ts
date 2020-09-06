export abstract class LogBase {
    public abstract debug(message: string): Promise<void>;
    public abstract error(err: Error): Promise<void>;
    public abstract info(message: string): Promise<void>;
    public abstract warn(message: string): Promise<void>;
}
