import { IsArray, IsOptional, Length } from 'class-validator';
import { Inject, Service } from 'typedi';

import { ApiBase } from '../../lib/net';
import { DbFactoryBase } from '../../lib/os/db';
import { IDGeneratorBase } from '../../lib/str/id-generator';
import { Menu, MenuChild } from '../../model/global';

@Service()
export default class AddOrSaveApi extends ApiBase {
  @Inject()
  public dbFactory: DbFactoryBase;

  @Inject()
  public idGenerator: IDGeneratorBase;

  @IsArray()
  public menus: MenuChild[];

  @IsOptional()
  @Length(20, 32)
  public id: string;


  public async invoke(): Promise<string> {
    const db = this.dbFactory.db<Menu>(Menu);
    const entries = await db.query().where({ id: this.id }).toArray();
    if (entries.length) {
      entries[0].menus = this.menus;
      await db.save(entries[0]);
    } else {
      entries.push({
        id: await this.idGenerator.generate(),
        menus: this.menus
      });
      await db.add(entries[0]);
    }
    return;
  }
}
