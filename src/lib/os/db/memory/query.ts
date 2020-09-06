import { MemoryRepository } from './repository';
import { QueryBase } from '../query-base';

export class MemoryQuery<T> extends QueryBase<T> {
    public constructor(private m_Repository: MemoryRepository<T>) {
        super();
    }

    public async count(): Promise<number> {
        return this.m_Repository.countValue;
    }

    public order(): this {
        return this;
    }

    public orderByDesc(): this {
        return this;
    }

    public skip(): this {
        return this;
    }
    public take(): this {
        return this;
    }

    public async toArray(): Promise<T[]> {
        return this.m_Repository.toArrayValue;
    }

    public where(): this {
        return this;
    }
}
