import { ComponentBase } from './base';

export class Application extends ComponentBase {
    public ExitAction = (code: number): void => {
        process.exit(code);
    };
    public ListenAction = (listener: () => Promise<void>): void => {
        process.on('SIGINT', listener);
    };
    public LogAction = (err: Error): void => {
        console.log(err);
    };

    public constructor(private m_Components: ComponentBase[]) {
        super();
    }

    public async load(): Promise<void> {
        try {
            for (let r of this.m_Components) {
                await r.load();
            }

            this.ListenAction(async () => {
                try {
                    await this.release();
                    this.ExitAction(0);
                } catch (ex) {
                    this.LogAction(ex);
                    this.ExitAction(6);
                }
            });
        } catch (ex) {
            this.LogAction(ex);
            this.ExitAction(1);
        }
    }

    public async release(): Promise<void> {
        for (let i = this.m_Components.length; i > 0; i--) {
            await this.m_Components[i - 1].release();
        }
    }
}
