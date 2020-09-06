import { DbPool } from './db-pool';
import { Repository } from './repository';
import { UnitOfWork } from './uow';
import {
  DbFactoryDbOption,
  DbFactoryBase,
  RepositoryBase,
  UnitOfWorkBase,
} from '..';

export class DbFactory extends DbFactoryBase {
  private static s_DbPool: DbPool;

  public constructor(private m_DbName: string) {
    super();

    if (!DbFactory.s_DbPool) {
      throw new Error('DbFactory.load');
    }
  }

  public db<T>(model: Function, option?: DbFactoryDbOption): RepositoryBase<T> {
    if (!option) {
      option = {};
    }

    option.isTx = true;
    option.tableName = model.name;
    if (!option.uow) {
      option.isTx = false;
      option.uow = this.uow();
    }

    return new Repository<T>(DbFactory.s_DbPool, this.m_DbName, option);
  }

  public uow(): UnitOfWorkBase {
    return new UnitOfWork(DbFactory.s_DbPool);
  }

  public static load(url: string) {
    DbFactory.s_DbPool = new DbPool(url);
  }

  public static async release(): Promise<void> {
    if (DbFactory.s_DbPool) {
      const client = await DbFactory.s_DbPool.getClient();
      await client.close();
    }
  }
}
