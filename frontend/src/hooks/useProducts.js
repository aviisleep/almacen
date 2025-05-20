import { useState, useEffect, useCallback } from "react";
import { getProducts, createProduct } from "../utils/api/productApi";

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getProducts();
      setProducts(res.data);
    } catch (err) {
      setError("Error al cargar productos");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addProduct = useCallback(async (newProduct) => {
    try {
      await createProduct(newProduct);
      await fetchProducts(); // Refrescar lista
      return true;
    } catch (err) {
      setError("Error al crear producto");
      return false;
    }
  }, [fetchProducts]);

  return {
    products,
    isLoading,
    error,
    fetchProducts,
    addProduct,
  };
};