
import request from '@/utils/request'
import { PermissionDataType } from './data.d'

export async function index(params?: PermissionDataType & { current?: number, pageSize?: number }) {
    return await request('/api/permissions', {
        params
    })
}

export async function create(params: PermissionDataType) {
    return await request('/api/permissions', {
        data: params,
        method: 'post'
    })
}

export async function destory(key: string) {
    return await request('/api/permissions/' + key, {
        method: 'delete'
    })
}