
import request from '@/utils/request'

// interface IPaging {
//     total: number
//     pageSize: number
//     current: number
// }
// interface IErrorResult {
//     err: boolean
//     errmsg: string
//     code: number
// }

// interface IPagiResult<T> {
//     data: T[],
//     pagi: IPaging
// }

// interface IService<T> {
//     show: (id: string) => Promise<T | IErrorResult>
//     index: (params: Partial<T> & { current?: number, pageSize?: number }) => Promise<IPagiResult<T> | IErrorResult>
//     create: (params: Partial<T>, id?: string) => Promise<T | any | IErrorResult>
//     update: (params: Partial<T>, id: string) => Promise<T | any | IErrorResult>
//     destory: (id: string) => Promise<any | IErrorResult>
// }

export class Service {

    api: string
    constructor(api: string) {
        this.api = api;
    }

    async show(id: string) {
        return await request(`${this.api}/${id}`);
    }

    async index(params: any & { current?: number, pageSize?: number }) {
        return await request(this.api, { params });
    }

    async create(params: any, id?: string) {
        return await request(this.api, { data: params, method: 'post' });
    }

    async update(params: any, id: string) {
        return await request(`${this.api}/${id}`, { data: params, method: 'put' });
    }

    async destory(id: string) {
        return await request(`${this.api}/${id}`, { method: 'delete' });
    }
}