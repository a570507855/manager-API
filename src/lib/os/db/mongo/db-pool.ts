import { Db, MongoClient } from 'mongodb';

export class DbPool {
    private m_Client: MongoClient;
    private m_NameOfDb = new Map<string, Db>();

    public constructor(private m_Url: string) {}

    public async getClient(): Promise<MongoClient> {
        if (!this.m_Client) {
            this.m_Client = new MongoClient(this.m_Url, {
                poolSize: 100,
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
        }

        if (!this.m_Client.isConnected()) {
            await this.m_Client.connect();
        }

        return this.m_Client;
    }

    public async getDb(name: string): Promise<Db> {
        if (!this.m_NameOfDb.has(name)) {
            const client = await this.getClient();
            this.m_NameOfDb.set(name, client.db(name));
        }

        return this.m_NameOfDb.get(name);
    }
}
