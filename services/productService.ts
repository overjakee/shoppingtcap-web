import api from "./api";
import { ProductResponse } from "@/models/dto/product";

const getAllProduct = async () : Promise<Array<ProductResponse>> => {
  const res = await api.get<Array<ProductResponse>>("/products");
  
  return res.data;
};


const getProductById = async (productId: number): Promise<ProductResponse> => {
  const res = await api.get<ProductResponse>(`/products/${productId}`);
  return res.data;
};


export const productService = {
  getAllProduct,
  getProductById
};