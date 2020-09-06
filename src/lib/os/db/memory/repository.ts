import { MemoryQuery } from './query';
import { MemoryUnitOfWork } from './uow';
import { QueryBase } from '../query-base';
import { RepositoryBase } from '../repository-base';

export class MemoryRepository<T> extends RepositoryBase<T> {
    private m_Query = new MemoryQuery(this);

    public countValue: number = 0;

    public toArrayValue: T[];

    public constructor(public uow: MemoryUnitOfWork) {
        super();
    }

    public async add(entry: T): Promise<void> {
        this.uow.addQueue.push(this.clone(entry));
    }

    public query(): QueryBase<T> {
        return this.m_Query;
    }

    public async remove(entry: T): Promise<void> {
        this.uow.removeQueue.push(this.clone(entry));
    }

    public async save(entry: T): Promise<void> {
        this.uow.saveQueue.push(this.clone(entry));
    }

    private clone(entry: any): any {
        return JSON.parse(JSON.stringify(entry));
    }
}
