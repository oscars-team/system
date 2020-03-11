// import request from '@/utils/request';
// import { TableListParams, CreateUserDataType } from './data.d'

// export async function index(params?: TableListParams) {
//     return await request('/api/member', {
//         params,
//     });
// }

// export async function create(params?: CreateUserDataType) {
//     return await request('/api/member', {
//         data: params,
//         method: 'post'
//     });
// }

import request from '@/utils/request'
import { AdminListItem, AdminDataType } from './data'

export async function index(params?: AdminListItem & { current?: number, pageSize?: number }) {
    return await request('/api/members', {
        params
    })
}

export async function create(params: AdminDataType) {
    return await request('/api/members', {
        data: params,
        method: 'post'
    })
}

export async function destory(key: string) {
    return await request('/api/members/' + key, {
        method: 'delete'
    })
}