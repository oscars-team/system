
import request from '@/utils/request'
import { VoucherListItem, MerchantVoucherQuery } from './data.d'

export async function index(params?: VoucherListItem & { current?: number, pageSize?: number }) {
    return await request('/api/campaign/mrchtvouchers', {
        params
    })
}

export async function create(params: Partial<MerchantVoucherQuery>) {
    console.log(params);
    return await request('/api/campaign/mrchtvouchers', {
        data: params,
        method: 'post'
    })
}

export async function destory(key: string) {
    return await request('/api/campaign/mrchtvouchers/' + key, {
        method: 'delete'
    })
}

export async function show(key: string) {
    return await request('/api/campaign/mrchtvouchers/' + key);
}