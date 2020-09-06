import { IsArray } from 'class-validator';
import { Inject, Service } from 'typedi';

import { ApiBase } from '../../lib/net';
import { DbFactoryBase } from '../../lib/os/db';
import { User } from '../../model/global';

@Service()
export default class RemoveApi extends ApiBase {
  @Inject()
  public dbFactory: DbFactoryBase;

  @IsArray()
  public ids: string[];

  public async invoke() {
    const db = this.dbFactory.db<User>(User);
    const users = await db
      .query()
      .where({ id: { $in: this.ids } })
      .toArray();
    if (!users.length) return;
    for (const user of users) {
      await db.remove(user);
    }
  }
}
