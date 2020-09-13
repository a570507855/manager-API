import { Max, Min } from 'class-validator';
import { Inject, Service } from 'typedi';

import { ApiBase } from '../../lib/net';
import { DbFactoryBase } from '../../lib/os/db';
import { Role } from '../../model/global';

@Service()
export default class RoleFindPageApi extends ApiBase {
  @Inject()
  public dbFactory: DbFactoryBase;

  @Max(Math.pow(2, 32))
  @Min(0)
  public skip: number;

  @Max(1000)
  @Min(1)
  public take: number;

  public async invoke(): Promise<any> {
    const db = this.dbFactory.db<Role>(Role);

    const query = db.query().skip(this.skip).take(this.take).order('createOn');
    return {
      rows: await query.toArray(),
      total: await query.count()
    };
  }
}

