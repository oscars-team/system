
export interface ModuleDataType {
    _id: string
    authority?: string[] | string
    parent?: string
    children: ModuleDataType[]
    hideChildrenInMenu?: boolean
    hideInMenu?: boolean
    icon?: string
    locale?: string
    name?: string
    path: string
}