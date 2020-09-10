import { IsOptional, Length, Max, Min } from 'class-validator';
import { Inject, Service } from 'typedi';

import { ApiBase } from '../../lib/net';
import { DbFactoryBase } from '../../lib/os/db';
import { Bug } from '../../model/task';

@Service()
export default class BugFindPageApi extends ApiBase {
  @Inject()
  public dbFactory: DbFactoryBase;

  @IsOptional()
  @Length(0, 20)
  public desc: string;

  @Max(Math.pow(2, 32))
  @Min(0)
  public skip: number;

  @IsOptional()
  @Max(Math.pow(2, 32))
  @Min(1)
  public state: number;

  @Max(1000)
  @Min(1)
  public take: number;

  public async invoke(): Promise<any> {
    const db = this.dbFactory.db<Bug>(Bug);
    let where: any = {};
    if (this.desc)
      where.desc = { $regex: this.desc };

    if (this.state)
      where.state = this.state;

    const query = db.query().where(where).skip(this.skip).take(this.take).order('createOn');
    return {
      rows: await query.toArray(),
      total: await query.count()
    };
  }
}

