import { UnitOfWorkBase } from '../uow-base';

export class MemoryUnitOfWork extends UnitOfWorkBase {
    public addQueue: any[] = [];

    public removeQueue: any[] = [];

    public saveQueue: any[] = [];

    public async commit(): Promise<void> {
        this.addQueue = [];
        this.removeQueue = [];
        this.saveQueue = [];
    }
}
