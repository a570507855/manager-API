import { QueryBase } from './query-base';

export abstract class RepositoryBase<T> {
  public abstract add(entry: T): Promise<void>;
  public abstract query(): QueryBase<T>;
  public abstract remove(entry: T): Promise<void>;
  public abstract save(entry: T): Promise<void>;
}
