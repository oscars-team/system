import request from '@/utils/request'
import { AccountLoginDataType } from './data.d';

export async function signin(params: AccountLoginDataType) {
    return await request('/api/signin', {
        data: params,
        method: 'post'
    })
}