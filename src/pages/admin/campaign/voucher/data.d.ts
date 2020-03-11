export interface VoucherListItem {
     // 编号
     _id?: string
     // 券标题
     title?: string
     // 券描述
     desc?: string
     // 券类型
     type?: number
     // 券价值
     value?: number
     // 使用条件
     condition?: any
     // 使用说明
     instruction?: string
     // 商户号
     merchant?: string
     // 创建日期
     create_at?: Date
     // 更新日期
     update_at?: Date
     // 失效日期
     expire_at?: Date
     // 被使用日期
     use_at?: Date
     // 票券状态
     state?: number
}

export interface MerchantVoucherQuery {
     // campaign id
     id?: string
     // campaign 中允许创建的优惠券的数量
     amount: number
     // 商户号
     merchant?: string
     // 优惠券标题
     title: string
     // 优惠券简要描述
     desc?: string
     // 优惠券类型
     // 1:折扣券 2:代金券 3:满减券
     type?: number
     // 使用条件
     condition?: any
     // 券价值
     value?: number
     // campaign 中有效开始日期
     start_at?: any
     // campaign 中的截止日期
     expire_at?: any
     // 详细使用说明
     instruction?: string
     // campaign 状态
     state?: number

     create_at?: any

}