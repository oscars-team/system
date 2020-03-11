
import request from '@/utils/request'
import { RoleDataType } from './data'

export async function index(params?: RoleDataType & { current?: number, pageSize?: number }) {
    return await request('/api/roles', {
        params
    })
}

export async function create(params: RoleDataType) {
    return await request('/api/roles', {
        data: params,
        method: 'post'
    })
}

export async function update(params: RoleDataType) {
    return await request('/api/roles/' + params._id, {
        data: params,
        method: 'put'
    })
}


export async function destory(key: string) {
    return await request('/api/roles/' + key, {
        method: 'delete'
    })
}