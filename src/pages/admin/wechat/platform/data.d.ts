import { IEntity } from "@/models/entity";

export interface IWechatPlatformEntity extends IEntity {
    // 公众号类型
    // 0 订阅号, 1 服务号
    type?: number
    // 服务号
    // 针对订阅号来说, 需要一个服务号用来获取用户资料
    service: any
    // 公众号的 appId
    appId: string
    // 公众阿訇的 appSecret
    appSecret: string
    // 服务器配置中的 令牌 Token
    serverToken: string
    // 服务器配置中的 消息加解密秘钥
    encodingAESKey: string
    // 公众号的原始ID
    originId: string
    // 平台微信号
    pname: string
}