import { Container } from 'typedi';

import { ComponentBase } from './base';
import { DbFactoryBase } from '../../lib/os/db';
import { DbFactory } from '../../lib/os/db/mongo';

export class Db extends ComponentBase {
  public async load(): Promise<void> {
    DbFactory.load('mongodb://localhost:27017');
    Container.set(DbFactoryBase, new DbFactory('node_API'));
  }

  public async release(): Promise<void> {
    await DbFactory.release();
  }
}
