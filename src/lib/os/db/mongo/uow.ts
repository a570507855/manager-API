import { ClientSession, Db } from 'mongodb';

import { DbPool } from './db-pool';
import { toDoc } from './helper';
import { UnitOfWorkBase } from '../uow-base';

export class UnitOfWork extends UnitOfWorkBase {
    private m_Queue: ((session: ClientSession) => Promise<void>)[] = [];

    public constructor(private m_DbPool: DbPool) {
        super();
    }

    public async commit(): Promise<void> {
        const client = await this.m_DbPool.getClient();
        const session = client.startSession();
        session.startTransaction();

        for (let r of this.m_Queue) {
            await r(session);
        }

        await session.commitTransaction();

        this.m_Queue = [];
    }

    public registerAdd(db: Db, table: string, entry: any): void {
        this.m_Queue.push(
            async (session: ClientSession): Promise<void> => {
                await db
                    .collection(table, {
                        session: session,
                    })
                    .insertOne(toDoc(entry));
            }
        );
    }

    public registerRemove(db: Db, table: string, entry: any): void {
        this.m_Queue.push(
            async (session: ClientSession): Promise<void> => {
                await db
                    .collection(table, {
                        session: session,
                    })
                    .deleteOne({
                        _id: entry.id,
                    });
            }
        );
    }

    public registerSave(db: Db, table: string, entry: any): void {
        this.m_Queue.push(
            async (session: ClientSession): Promise<void> => {
                await db
                    .collection(table, {
                        session: session,
                    })
                    .updateOne(
                        {
                            _id: entry.id,
                        },
                        {
                            $set: toDoc(entry),
                        }
                    );
            }
        );
    }
}
