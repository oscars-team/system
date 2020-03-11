import { IEntity } from "./entity";

export interface ContentCampaignEntity extends IEntity {
    content: string
    // 策略描述
    description: string,
    // 转发深度
    depth: number,
    // 引导关注的微信平台
    platform: string
    // 以下属性为规则
    // 是否强制关注
    isForce: boolean,
    // 是否显示一部分
    isPartial: boolean,
    // 部分显示页数
    partialPages: number,
    // 能否跳过
    canSkip: boolean,
    // 强制关注几率
    chance: number,
    // 浏览器限制, [ 'desktop', 'mobile' ]
    browsers: string[]
    // 是否为默认策略
    isDefault: boolean
}

export interface ArticleQuery {
    id?: string
    title?: string
    author: string
    desc: string
    content: string
    thumb: string
    state: number

}

export interface ArticleModel {
    _id?: string
    title?: string
    author: string
    desc: string
    content: string
    thumb: string
    state: number,
    create_at: Date,
    update_at: Date

}