import * as moment from 'moment';

import { LogBase } from './base';

export class ConsoleLog extends LogBase {
    public async debug(message: string): Promise<void> {
        this.show('debug', message);
    }

    public async error(err: Error): Promise<void> {
        this.show('error', err);
    }

    public async info(message: string): Promise<void> {
        this.show('info', message);
    }

    public async warn(message: string): Promise<void> {
        this.show('warn', message);
    }

    private show(op: string, arg: any): void {
        console[op](moment().format('YYYY-MM-DD HH:mm:ss'), `[${op}]`, arg);
    }
}
