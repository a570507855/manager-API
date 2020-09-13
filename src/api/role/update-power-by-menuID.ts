import { Max, Min } from 'class-validator';
import { Inject, Service } from 'typedi';

import { ApiBase } from '../../lib/net';
import { DbFactoryBase } from '../../lib/os/db';
import { Role } from '../../model/global';

@Service()
export default class RoleUpdatePowerByMenuIDApi extends ApiBase {
  @Inject()
  public dbFactory: DbFactoryBase;

  @Max(Math.max(2, 32))
  @Min(0)
  public menuID: number;

  public async invoke(): Promise<void> {
    const db = this.dbFactory.db<Role>(Role);
    const entries = await db.query().toArray();
    entries.forEach(async item => {
      Object.keys(item.power).some(key => {
        if (+key === this.menuID)
          return delete item.power[key];

        let index = item.power[key].findIndex((item: number) => item === this.menuID);
        if (index !== -1)
          return item.power[key].splice(index, 1) && true;
      });
      await db.save(item);
    });
  }
}
