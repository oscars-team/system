
import request from '@/utils/request'
import { ModuleDataType } from './data'

export async function index(params?: ModuleDataType & { current?: number, pageSize?: number }) {
    return await request('/api/modules', {
        params
    })
}

export async function create(params: ModuleDataType) {
    return await request('/api/modules', {
        data: params,
        method: 'post'
    })
}

export async function destory(key: string) {
    return await request('/api/modules/' + key, {
        method: 'delete'
    })
}