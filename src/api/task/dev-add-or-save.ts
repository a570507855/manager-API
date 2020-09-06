import { IsOptional, Length, Max, Min } from 'class-validator';
import { Inject, Service } from 'typedi';

import { ApiBase } from '../../lib/net';
import { DbFactoryBase } from '../../lib/os/db';
import { IDGeneratorBase } from '../../lib/str/id-generator';
import { Development } from '../../model/task';

@Service()
export default class AddOrSaveApi extends ApiBase {
  @Inject()
  public dbFactory: DbFactoryBase;

  @Inject()
  public idGenerator: IDGeneratorBase;

  @IsOptional()
  @Length(20, 32)
  public id: string;

  @Length(0, 20)
  public taskName: string;

  @Length(0, 100)
  public desc: string;

  @Length(0, 200)
  public demand: string;

  @Max(Math.pow(2, 32))
  @Min(0)
  public status: number;

  public async invoke(): Promise<string> {
    const db = this.dbFactory.db<Development>(Development);
    const entries = await db.query().where({ id: this.id }).toArray();
    if (entries.length) {
      entries[0].taskName = this.taskName;
      entries[0].desc = this.desc;
      entries[0].demand = this.demand;
      entries[0].status = this.status;
      entries[0].completeOn = this.status === 3 ? Math.floor(new Date().getTime() / 1000) : 0;

      await db.save(entries[0]);
    } else {
      entries.push({
        id: await this.idGenerator.generate(),
        taskName: this.taskName,
        desc: this.desc,
        demand: this.demand,
        status: this.status,
        createOn: Math.floor(new Date().getTime() / 1000)
      });

      await db.add(entries[0]);
    }
    return;
  }
}
