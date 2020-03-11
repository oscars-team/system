
import request from '@/utils/request'
import { ContentCampaignEntity } from '@/models/contentcampaign'

export async function index(params?: ContentCampaignEntity & { current?: number, pageSize?: number }) {
    return await request('/api/contentcampaigns', {
        params
    })
}

export async function create(params: Partial<ContentCampaignEntity>) {
    return await request('/api/contentcampaigns', {
        data: params,
        method: 'post'
    })
}

export async function update(key: string, params: Partial<ContentCampaignEntity>) {
    return await request('/api/contentcampaigns/' + key, {
        data: params,
        method: 'put'
    })
}


export async function destory(key: string) {
    return await request('/api/contentcampaigns/' + key, {
        method: 'delete'
    })
}

export async function show(key: string) {
    return await request('/api/contentcampaigns/' + key);
}