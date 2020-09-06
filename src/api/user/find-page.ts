import { Max, Min } from 'class-validator';
import { Service, Inject } from 'typedi';

import { ApiBase } from '../../lib/net';
import { DbFactoryBase } from '../../lib/os/db';
import { User } from '../../model/global';

@Service()
export default class FindPageApi extends ApiBase {
  @Inject()
  public dbFactory: DbFactoryBase;

  @Max(Math.pow(2, 32))
  @Min(0)
  public skip: number;

  @Max(1000)
  @Min(1)
  public take: number;

  public async invoke(): Promise<any> {
    const db = this.dbFactory.db<User>(User);

    const row = await db.query().skip(this.skip).take(this.take).toArray();
    return {
      rows: row,
      total: await db.query().count(),
    };
  }
}
