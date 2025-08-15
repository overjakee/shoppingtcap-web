export interface GetCartResponse{
    id : number;
    productId : number;
    productName : string;
    unit : string;
    quantity : number;
    price : number;
}


export interface AddCartRequest{
    productId : number;
    quantity : number;
}

export interface AddCartResponse{
    isSuccess : boolean;
    cartId : number;
}

export interface UpdateCartRequest{
    productId : number;
    quantity : number;
}

export interface UpdateCartResponse{
    isSuccess : boolean;
}

export interface DeleteCartResponse{
    isSuccess : boolean;
}

export interface DeleteCartAllResponse{
    isSuccess : boolean;
}

export interface CheckoutResponse{
    isSuccess : boolean;
    totalAmount : number;
}