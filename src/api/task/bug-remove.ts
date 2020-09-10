import { IsArray } from 'class-validator';
import { Inject, Service } from 'typedi';

import { ApiBase } from '../../lib/net';
import { DbFactoryBase } from '../../lib/os/db';
import { Bug } from '../../model/task';

@Service()
export default class BugRemoveApi extends ApiBase {
  @Inject()
  public dbFactory: DbFactoryBase;

  @IsArray()
  public ids: string[];

  public async invoke() {
    const db = this.dbFactory.db<Bug>(Bug);
    const bugs = await db
      .query()
      .where({ id: { $in: this.ids } })
      .toArray();
    if (!bugs.length) return;
    for (const bug of bugs) {
      await db.remove(bug);
    }
  }
}
