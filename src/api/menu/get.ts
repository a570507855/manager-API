import { Service, Inject } from 'typedi';

import { ApiBase } from '../../lib/net';
import { DbFactoryBase } from '../../lib/os/db';
import { Menu } from '../../model/global';

@Service()
export default class GetMenuApi extends ApiBase {
  @Inject()
  public dbFactory: DbFactoryBase;

  public async invoke(): Promise<any> {
    const db = this.dbFactory.db<Menu>(Menu);

    const menus = await db.query().toArray();

    return {
      ...menus[0],
    };
  }
}
