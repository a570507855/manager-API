import { LogBase } from './base';

export class NullLog extends LogBase {
    public async debug(): Promise<void> {}

    public async error(): Promise<void> {}

    public async info(): Promise<void> {}

    public async warn(): Promise<void> {}
}
