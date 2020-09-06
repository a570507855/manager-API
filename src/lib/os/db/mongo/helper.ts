import * as $ from 'underscore';

export function toDoc(entry: any): any {
    return $.chain(entry)
        .clone()
        .extend({
            _id: entry.id,
        })
        .omit('id')
        .value();
}

export function toEntries(docs: any[]): any[] {
    return $.map(docs, (r): any => {
        return $.chain(r)
            .clone()
            .omit('_id')
            .extend({
                id: r._id,
            })
            .value();
    });
}
