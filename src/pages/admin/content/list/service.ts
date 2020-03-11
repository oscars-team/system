
import request from '@/utils/request'
import { ArticleListQuery } from './data.d'

export async function index(params?: ArticleListQuery & { current?: number, pageSize?: number }) {
    return await request('/api/contents', {
        params
    })
}

export async function create(params: Partial<ArticleListQuery>) {
    return await request('/api/contents', {
        data: params,
        method: 'post'
    })
}

export async function update(key: string, params: Partial<ArticleListQuery>) {
    if (!key) return;
    return await request('/api/contents/' + key, {
        data: params,
        method: 'put'
    })
}


export async function destory(key: string) {
    if (!key) return;
    return await request('/api/contents/' + key, {
        method: 'delete'
    })
}

export async function show(key: string) {
    if (!key) return;
    return await request('/api/contents/' + key);
}