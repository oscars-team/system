
import request from '@/utils/request'
import { SimpleUploadQuery } from './data.d'

export async function index(params?: SimpleUploadQuery & { current?: number, pageSize?: number }) {
    return await request('/api/static/resources', {
        params
    })
}

export async function create(params: any) {
    return await request('/api/static/resources', {
        data: params,
        method: 'post'
    })
}

export async function update(key: string, params: Partial<SimpleUploadQuery>) {
    if (!key) return;
    return await request('/api/static/resources/' + key, {
        data: params,
        method: 'put'
    })
}


export async function destory(key: string) {
    if (!key) return;
    return await request('/api/static/resources/' + key, {
        method: 'delete'
    })
}

export async function show(key: string) {
    if (!key) return;
    return await request('/api/static/resources/' + key);
}