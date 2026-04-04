import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  originalPrice: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (wine: any) => void;
  removeFromCart: (wine: any) => void;
  deleteFromCart: (wine: any) => void;
  clearCart: () => void;
  totalPrice: number;
  totalSavings: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // ----- LOAD DATA ON STARTUP ----------
  useEffect(() => {
    const loadCart = async () => {
      try {
        const savedCart = await AsyncStorage.getItem("WEIN_STORE_CART");
        if (savedCart) {
          setCart(JSON.parse(savedCart));
        }
      } catch (e) {
        console.error("Failed to load cart", e);
      }
    };
    loadCart();
  }, []);

  // -------- SAVE DATA WHENEVER CART CHANGES ----------

  useEffect(() => {
    const saveCart = async () => {
      try {
        await AsyncStorage.setItem("WEIN_STORE_CART", JSON.stringify(cart));
      } catch (e) {
        console.error("Failed to save cart", e);
      }
    };
    saveCart();
  }, [cart]);

  const removeFromCart = (id: string) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === id);
      if (existingItem && existingItem.quantity > 1) {
        return prevCart.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item,
        );
      }
      return prevCart.filter((item) => item.id !== id);
    });
  };

  const addToCart = (wine: any) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === wine.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === wine.id ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }

      return [
        ...prevCart,
        {
          id: wine.id,
          name: wine.name,
          price: wine.price,
          quantity: 1,
          originalPrice: wine.originalPrice || wine.price,
        },
      ];
    });
  };

  const deleteFromCart = (id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const totalSavings = cart.reduce((sum, item) => {
    if (item.originalPrice && item.originalPrice > item.price) {
      return sum + (item.originalPrice - item.price) * item.quantity;
    }
    return sum;
  }, 0);

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        deleteFromCart,
        clearCart,
        totalPrice,
        totalSavings,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
