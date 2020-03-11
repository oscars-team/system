
import request from '@/utils/request'
import { ArticleQuery } from './data.d'

export async function index(params?: ArticleQuery & { current?: number, pageSize?: number }) {
    return await request('/api/contents', {
        params
    })
}

export async function create(params: Partial<ArticleQuery>) {
    return await request('/api/contents', {
        data: params,
        method: 'post'
    })
}

export async function update(key: string, params: Partial<ArticleQuery>) {
    return await request('/api/contents/' + key, {
        data: params,
        method: 'put'
    })
}


export async function destory(key: string) {
    return await request('/api/contents/' + key, {
        method: 'delete'
    })
}

export async function show(key: string) {
    return await request('/api/contents/' + key);
}