import { ObjectID } from 'mongodb';

import { IDGeneratorBase } from './base';

export class MongoIDGenerator extends IDGeneratorBase {
    public async generate(): Promise<string> {
        return new ObjectID().toHexString();
    }
}
