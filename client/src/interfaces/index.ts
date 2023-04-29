export interface Task {
    id?: number,
    title: string,
    date: number,
    description: string,
    color?: string,
    status: 'new' | 'progress' | 'finish',
}

export interface Product {
    _id?: number,
    name: string,
    description: string,
    price: number,
    quantity: number,
    images: string[],
    categoryid: Category | number,
    history?: StorageHistory[],
    [key: string]: any
}

export interface Category {
    _id?: number,
    name: string,
    description?: string,
}

export interface StorageHistory {
    productid?: number | Product,
    count: number,
    add?: boolean,
    status: number
}

export interface User {
    id?: number,
    name: string,
    email: string,
    phone: string,
    address: string,
    image: string,
    role: 'admin' | 'user',
    [key: string]: any
}

export interface Order {
    id?: number,
    clientid: User,
    productList: ProductList[],
    price: number,
    address: string,
    date: number,
    status: 'new' | 'processed' | 'shipped' | 'delivered'
}

export interface ProductList {
    product?: Product,
    productid?: number,
    price: number,
    count: number
}