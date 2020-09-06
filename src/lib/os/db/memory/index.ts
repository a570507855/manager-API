import { MemoryRepository } from './repository';
import { MemoryUnitOfWork } from './uow';
import { DbFactoryBase, DbFactoryDbOption } from '../factory-base';

export class MemoryDbFactory extends DbFactoryBase {
  public db<T>(_: Function, option?: DbFactoryDbOption): MemoryRepository<T> {
    const uow = option ? option.uow : this.uow();
    return new MemoryRepository(uow as MemoryUnitOfWork);
  }

  public uow(): MemoryUnitOfWork {
    return new MemoryUnitOfWork();
  }
}
