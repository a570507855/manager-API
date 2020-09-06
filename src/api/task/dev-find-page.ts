import { IsOptional, Length, Max, Min } from 'class-validator';
import { Inject, Service } from 'typedi';

import { ApiBase } from '../../lib/net';
import { DbFactoryBase } from '../../lib/os/db';
import { Development } from '../../model/task';

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

  @IsOptional()
  @Length(0, 20)
  public taskName: string;

  @IsOptional()
  @Max(Math.pow(2, 32))
  @Min(1)
  public status: number;

  public async invoke(): Promise<any> {
    const db = this.dbFactory.db<Development>(Development);
    let where: any = {};
    if (this.taskName)
      where.taskName = { $regex: this.taskName };;

    if (this.status)
      where.status = this.status;

    const row = await db.query().where(where).skip(this.skip).take(this.take).toArray();
    return {
      rows: row,
      total: await db.query().where(where).count(),
    };
  }
}
