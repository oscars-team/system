
export interface PermissionItemDataType {
    moduleId: string,
    value: number
}


export interface RoleDataType {
    _id: string
    name: string,
    permissions: PermissionItemDataType[]
}