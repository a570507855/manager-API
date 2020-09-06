import { DbPool } from './db-pool';
import { Query } from './query';
import { QueryBase, RepositoryBase } from '..';
import { DbFactoryDbOption } from '../factory-base';

export class Repository<T> extends RepositoryBase<T> {
    public constructor(
        private m_DbPool: DbPool,
        private m_DbName: string,
        private m_DbOption: DbFactoryDbOption
    ) {
        super();
    }

    public async add(entry: T): Promise<void> {
        await this.exec('registerAdd', entry);
    }

    public query(): QueryBase<T> {
        return new Query<T>(this.m_DbPool, this.m_DbName, this.m_DbOption.tableName);
    }

    public async remove(entry: T): Promise<void> {
        await this.exec('registerRemove', entry);
    }

    public async save(entry: T): Promise<void> {
        await this.exec('registerSave', entry);
    }

    private async exec(method: string, entry: any): Promise<void> {
        const db = await this.m_DbPool.getDb(this.m_DbName);
        this.m_DbOption.uow[method](db, this.m_DbOption.tableName, entry);

        if (this.m_DbOption.isTx) {
            return;
        }

        await this.m_DbOption.uow.commit();
    }
}
