import { IsOptional, Length, Max, Min } from 'class-validator';
import { Inject, Service } from 'typedi';

import { ApiBase } from '../../lib/net';
import { DbFactoryBase } from '../../lib/os/db';
import { IDGeneratorBase } from '../../lib/str/id-generator';
import { BugState } from '../../model/enum';
import { Bug } from '../../model/task';

@Service()
export default class BugAddOrSaveApi extends ApiBase {
  @Inject()
  public dbFactory: DbFactoryBase;

  @Inject()
  public idGenerator: IDGeneratorBase;

  @IsOptional()
  @Length(20, 32)
  public id: string;

  @Length(0, 100)
  public desc: string;

  @Length(0, 300)
  public solution: string;

  @IsOptional()
  @Max(Math.pow(2, 32))
  @Min(0)
  public state: number;

  public async invoke(): Promise<string> {
    const db = this.dbFactory.db<Bug>(Bug);
    const entries = await db.query().where({ id: this.id }).toArray();
    if (entries.length) {
      entries[0].desc = this.desc;
      entries[0].solution = this.solution;
      if (this.state) {
        entries[0].state = this.state;
        entries[0].completeOn = this.state === BugState.completed ? Math.floor(new Date().getTime() / 1000) : 0;
      }
      await db.save(entries[0]);
    } else {
      entries.push({
        id: await this.idGenerator.generate(),
        desc: this.desc,
        solution: this.solution,
        state: BugState.pending,
        createOn: Math.floor(new Date().getTime() / 1000),
        completeOn: 0
      });
      await db.add(entries[0]);
    }
    return;
  }
}
