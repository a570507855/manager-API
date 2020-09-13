import { IsArray } from 'class-validator';
import { Inject, Service } from 'typedi';

import { ApiBase } from '../../lib/net';
import { DbFactoryBase } from '../../lib/os/db';
import { Role } from '../../model/global';

@Service()
export default class RoleRemoveApi extends ApiBase {
  @Inject()
  public dbFactory: DbFactoryBase;

  @IsArray()
  public ids: string[];

  public async invoke() {
    const db = this.dbFactory.db<Role>(Role);
    const Roles = await db
      .query()
      .where({ id: { $in: this.ids } })
      .toArray();
    if (!Roles.length) return;
    for (const role of Roles) {
      await db.remove(role);
    }
  }
}
