import { RepositoryBase } from './repository-base';
import { UnitOfWorkBase } from './uow-base';

export class DbFactoryDbOption {
  public isTx?: boolean;
  public tableName?: string;
  public uow?: UnitOfWorkBase;
}

export abstract class DbFactoryBase {
  public abstract db<T>(
    model: Function,
    option?: DbFactoryDbOption
  ): RepositoryBase<T>;
  public abstract uow(): UnitOfWorkBase;
}
