import api from "./api";
import { ProductResponse } from "@/models/dto/product";

// ไม่ได้ใช้แต่เพื่อไว้
const  getAllProductproductStock = async () : Promise<Array<ProductResponse>> => {
  const res = await api.get<Array<ProductResponse>>("/productStock");
  
  return res.data;
};


const getProductStockById = async (productId: number): Promise<ProductResponse> => {
  const res = await api.get<ProductResponse>(`/productStock/${productId}`);
  return res.data;
};



export const productService = {
  getAllProductproductStock,
  getProductStockById
};