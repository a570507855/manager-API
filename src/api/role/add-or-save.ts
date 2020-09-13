import { IsObject, IsOptional, Length } from 'class-validator';
import { Inject, Service } from 'typedi';

import { ApiBase } from '../../lib/net';
import { DbFactoryBase } from '../../lib/os/db';
import { IDGeneratorBase } from '../../lib/str/id-generator';
import { Role } from '../../model/global';

@Service()
export default class RoleAddOrSaveApi extends ApiBase {
  @Inject()
  public dbFactory: DbFactoryBase;

  @Inject()
  public idGenerator: IDGeneratorBase;

  @IsOptional()
  @Length(20, 32)
  public id: string;

  @Length(0, 100)
  public name: string;

  @IsObject()
  public power: { [key: number]: number[] };

  public async invoke(): Promise<string> {
    const db = this.dbFactory.db<Role>(Role);
    const entries = await db.query().where({ id: this.id }).toArray();
    if (entries.length) {
      entries[0].name = this.name;
      entries[0].power = this.power;
      entries[0].modifiedOn = Math.floor(new Date().getTime() / 1000);
      await db.save(entries[0]);
    } else {
      entries.push({
        id: await this.idGenerator.generate(),
        name: this.name,
        power: this.power,
        nums: 0,
        createOn: Math.floor(new Date().getTime() / 1000),
      });
      await db.add(entries[0]);
    }
    return;
  }
}
