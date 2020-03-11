/**
 * export the item model of Table 'admin'
 */
export interface AdminListItem {
    _id?: string | any,
    // loginname?: string,
    // displayname?: string,
    // password?: string,
    // salt?: string,
    email?: string,
    phone?: string,
    // avatar?: string,
    country?: string,
    province?: string,
    city?: string,
    // role?: string,
    // pers?: any,
    create_at?: Date,
    // update_at?: Date

    name?: string,
    avatar_url?: string,
    // permissions?: any
    // _id: string;
    // loginname?: string;
    // displayname: string;
    // email: string;
    // phone: string;
    // avatar: string;
    // desc: string;
    // country: string;
    // province: string;
    // city: string;
    // create_at: Date;
}

/**
 * export the data type of Admin forms
 */
export interface AdminDataType extends Partial<AdminListItem> {
    loginname?: string,
    displayname?: string,
    password?: string,
    // role?: string,
    // pers?: any,
}

// export interface CreateUserDataType extends Partial<TableListItem> {
//     password?: string
// }

// export interface TableListItem {
//     _id: string;
//     loginname?: string;
//     displayname: string;
//     email: string;
//     phone: string;
//     avatar: string;
//     desc: string;
//     country: string;
//     province: string;
//     city: string;
//     create_at: Date;
// }

// export interface TableListPagination {
//     total: number;
//     pageSize: number;
//     current: number;
// }

// export interface TableListData {
//     list: TableListItem[];
//     pagination: Partial<TableListPagination>;
// }

// export interface TableListParams {
//     sorter?: string;
//     status?: string;
//     loginname?: string,
//     displayname?: string,
//     email?: string,
//     phone?: string,
//     name?: string;
//     desc?: string;
//     key?: number;
//     pageSize?: number;
//     currentPage?: number;
// }
