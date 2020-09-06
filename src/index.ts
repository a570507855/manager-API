import 'reflect-metadata';
import { Application, Db, Env, ExpressServer } from './infrastructure/component';
import { HttpPostController } from './infrastructure/controller';
import { } from './infrastructure/component/';

(async () => {
  new Application([
    new Db(),
    new Env(),
    new ExpressServer([HttpPostController])
  ]).load();
})();
