import { databases } from '$lib/appwrite';
import { Query } from 'appwrite';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent, url }) => {
    const data = await parent();

    const page = +(url.searchParams.get('page') ?? '1');
    const filter = url.searchParams.get('filter') ?? 'all';
    const sort = url.searchParams.get('sort') ?? 'dateDesc';
    
    const limit = 5;
    const offset = (page - 1) * limit;

    let sortQuery = Query.orderDesc('$createdAt');
    switch(sort) {
        case 'dateAsc':
            sortQuery = Query.orderAsc('$createdAt');
            break;
        case 'dateDesc':
            sortQuery = Query.orderDesc('$createdAt');
            break;
        case 'nameDesc':
            sortQuery = Query.orderDesc('name');
            break;
        case 'nameAsc':
            sortQuery = Query.orderDesc('name');
            break;
    }

    const queries = [
        Query.equal('userId', data.user?.$id ?? ''),
        Query.limit(limit),
        Query.offset(offset),
        sortQuery
    ];

    switch(filter) {
        case 'daily':
            queries.push(Query.equal('type', filter));
            break;
        case 'weekly':
            queries.push(Query.equal('type', filter));
            break;
        case 'monthly':
            queries.push(Query.equal('type', filter));
            break;
        case 'yearly':
            queries.push(Query.equal('type', filter));
            break;
        case 'onetime':
            queries.push(Query.equal('type', filter));
            break;
    }

    const reminders = await databases.listDocuments('main', 'reminders', queries);

    return {
        reminders,
        limit,
        offset,
        sort,
        filter,
        page,
        pageId: url.toString()
    }
};