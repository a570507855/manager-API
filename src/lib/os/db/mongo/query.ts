import { Cursor, FilterQuery } from 'mongodb';
import * as $ from 'underscore';

import { DbPool } from './db-pool';
import { toEntries } from './helper';
import { QueryBase } from '../query-base';

const entryField = 'id';

export class Query<T> extends QueryBase<T> {
  private m_Skip: number;
  private m_Sorts: [string, 1 | -1][] = [];
  private m_Take: number;
  private m_Where: FilterQuery<any>;

  public constructor(
    private m_DbPool: DbPool,
    private m_DbName: string,
    private m_Table: string
  ) {
    super();
  }

  public async count(): Promise<number> {
    const cursor = await this.getCursor();
    return await cursor.count();
  }

  public order(...fields: string[]): this {
    return this.sort(1, ...fields);
  }

  public orderByDesc(...fields: string[]): this {
    return this.sort(-1, ...fields);
  }

  public skip(value: number): this {
    this.m_Skip = value;
    return this;
  }

  public take(value: number): this {
    this.m_Take = value;
    return this;
  }

  public async toArray(): Promise<T[]> {
    const cursor = await this.getCursor();
    const rows = await cursor.toArray();
    return toEntries(rows);
  }

  public where(filter: any): this {
    this.m_Where = $.has(filter, entryField)
      ? $.chain(filter)
          .extend({
            _id: filter.id,
          })
          .omit('id')
          .value()
      : filter;
    return this;
  }

  private async getCursor(): Promise<Cursor<any>> {
    const db = await this.m_DbPool.getDb(this.m_DbName);
    const cursor = db.collection(this.m_Table).find(this.m_Where);
    if (this.m_Sorts.length) cursor.sort(this.m_Sorts);
    if (this.m_Skip > 0) cursor.skip(this.m_Skip);
    if (this.m_Take > 0) cursor.limit(this.m_Take);
    return cursor;
  }

  private sort(order: 1 | -1, ...fields: string[]): this {
    for (let r of fields) {
      if (r == entryField) r = '_id';

      this.m_Sorts.push([r, order]);
    }
    return this;
  }
}
