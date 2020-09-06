import { IsArray, IsOptional, Length, Max, Min } from 'class-validator';
import { Inject, Service } from 'typedi';

import { ApiBase } from '../../lib/net';
import { DbFactoryBase } from '../../lib/os/db';
import { IDGeneratorBase } from '../../lib/str/id-generator';
import { User } from '../../model/global';

@Service()
export default class AddOrSaveApi extends ApiBase {
  @Inject()
  public dbFactory: DbFactoryBase;

  @Inject()
  public idGenerator: IDGeneratorBase;

  @Length(3, 8)
  public name: string;

  @Max(Math.pow(2, 32))
  @Min(0)
  public sex: number;

  @Max(Math.pow(2, 32))
  @Min(0)
  public age: number;

  @Length(6, 20)
  public account: string;

  @Length(6, 20)
  public password: string;

  @IsArray()
  public role: number[];

  @IsArray()
  public power: number[];

  @Max(Math.pow(2, 32))
  @Min(0)
  public createOn: number;

  @Max(Math.pow(2, 32))
  @Min(0)
  public loginOn: number;

  @IsOptional()
  @Length(20, 32)
  public id: string;


  public async invoke(): Promise<string> {
    const db = this.dbFactory.db<User>(User);
    const entries = await db.query().where({ id: this.id }).toArray();
    if (entries.length) {
      entries[0].name = this.name;
      entries[0].sex = this.sex;
      entries[0].age = this.age;
      entries[0].account = this.account;
      entries[0].password = this.password;
      entries[0].role = this.role;
      entries[0].power = this.power;
      entries[0].createOn = this.createOn;
      entries[0].loginOn = this.loginOn;
      entries[0].modifiedOn = Math.floor(new Date().getTime() / 1000);
      await db.save(entries[0]);
    } else {
      entries.push({
        id: await this.idGenerator.generate(),
        name: this.name,
        sex: this.sex,
        age: this.age,
        account: this.account,
        password: this.password,
        role: this.role,
        power: this.power,
        createOn: Math.floor(new Date().getTime() / 1000),
        loginOn: this.loginOn,
        modifiedOn: Math.floor(new Date().getTime() / 1000),
      });
      await db.add(entries[0]);
    }
    return entries[0].id;
  }
}
