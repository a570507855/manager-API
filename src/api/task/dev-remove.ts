import { IsArray } from 'class-validator';
import { Inject, Service } from 'typedi';

import { ApiBase } from '../../lib/net';
import { DbFactoryBase } from '../../lib/os/db';
import { Development } from '../../model/task';

@Service()
export default class RemoveApi extends ApiBase {
  @Inject()
  public dbFactory: DbFactoryBase;

  @IsArray()
  public ids: string[];

  public async invoke() {
    const db = this.dbFactory.db<Development>(Development);
    const devs = await db
      .query()
      .where({ id: { $in: this.ids } })
      .toArray();
    if (!devs.length) return;
    for (const dev of devs) {
      await db.remove(dev);
    }
  }
}
