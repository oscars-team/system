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