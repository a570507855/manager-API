import { Container } from 'typedi';
import { ComponentBase } from './base';
import { LogBase, ConsoleLog } from '../../lib/os/log';
import { IDGeneratorBase, MongoIDGenerator } from '../../lib/str/id-generator';


export class Env extends ComponentBase {
  public async load(): Promise<void> {
    Container.set(LogBase, new ConsoleLog());
    Container.set(IDGeneratorBase, new MongoIDGenerator());
  }
}
