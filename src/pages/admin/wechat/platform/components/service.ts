
import request from '@/utils/request'
import { IWechatPlatformEntity } from '../data.d'

export async function index(params?: IWechatPlatformEntity & { current?: number, pageSize?: number }) {
    return await request('/api/wxplatforms', {
        params
    })
}

export async function create(params: Partial<IWechatPlatformEntity>) {
    return await request('/api/wxplatforms', {
        data: params,
        method: 'post'
    })
}

export async function update(key: string, params: Partial<IWechatPlatformEntity>) {
    if (!key) return;
    return await request('/api/wxplatforms/' + key, {
        data: params,
        method: 'put'
    })
}


export async function destory(key: string) {
    if (!key) return;
    return await request('/api/wxplatforms/' + key, {
        method: 'delete'
    })
}

export async function show(key: string) {
    if (!key) return;
    return await request('/api/wxplatforms/' + key);
}