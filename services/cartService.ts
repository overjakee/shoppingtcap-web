import { AddCartRequest, AddCartResponse, CheckoutResponse, DeleteCartAllResponse, DeleteCartResponse, GetCartResponse, UpdateCartRequest, UpdateCartResponse } from "@/models/dto/cart";
import api from "./api";

const getAllCart = async () : Promise<Array<GetCartResponse>> => {
  const res = await api.get<Array<GetCartResponse>>("/cart");
  
  return res.data;
};

const addCart = async (request : AddCartRequest) : Promise<AddCartResponse> => {
  const res = await api.post<AddCartResponse>("/cart",request);
  
  return res.data;
};

const updateCart = async (cartId : number, request : UpdateCartRequest) : Promise<UpdateCartResponse> => {
  const res = await api.put<UpdateCartResponse>(`/cart/${cartId}`,request);
  
  return res.data;
};


const removeCart = async (cartId: number): Promise<DeleteCartResponse> => {
  const res = await api.delete<DeleteCartResponse>(`/cart/${cartId}`);
  return res.data;
};

const removeCartAll = async (): Promise<DeleteCartAllResponse> => {
  const res = await api.delete<DeleteCartAllResponse>(`/cart`);
  return res.data;
};

const checkoutCartAll = async (): Promise<CheckoutResponse> => {
  const res = await api.post<CheckoutResponse>(`/cart/checkout`);
  return res.data;
};

export const cartService = {
    getAllCart,
    addCart,
    updateCart,
    removeCart,
    removeCartAll,
    checkoutCartAll
};