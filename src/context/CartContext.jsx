import { createContext, useState, useContext, useEffect } from 'react';
import { createCartItem, deleteCartItem } from '../services/api';

// Crear el contexto
export const CartContext = createContext();

// Hook personalizado para usar el contexto
export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart debe ser usado dentro de un CartProvider');
    }
    return context;
};

// Provider del contexto
export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [totalItems, setTotalItems] = useState(0);

    // Agregar producto al carrito y a la API (ahora síncrono para evitar problemas de renderizado)
    const addToCart = (product, quantity = 1) => {
        setCart(currentCart => {
            const existingProductIndex = currentCart.findIndex(item => item.id === product.id);
            if (existingProductIndex >= 0) {
                const updatedCart = [...currentCart];
                const newQuantity = updatedCart[existingProductIndex].quantity + quantity;
                if (newQuantity <= 0) {
                    // Eliminar producto si la cantidad llega a 0
                    return updatedCart.filter((_, idx) => idx !== existingProductIndex);
                }
                updatedCart[existingProductIndex] = {
                    ...updatedCart[existingProductIndex],
                    quantity: newQuantity
                };
                return updatedCart;
            } else if (quantity > 0) {
                return [...currentCart, { ...product, quantity }];
            } else {
                return currentCart;
            }
        });
        setTotalItems(prevTotal => Math.max(prevTotal + quantity, 0));
        // Ya no se sincroniza el carrito con la API
    };

    // Eliminar producto del carrito y de la API
    const removeFromCart = (productId) => {
        setCart(currentCart => {
            const productToRemove = currentCart.find(item => item.id === productId);
            if (!productToRemove) {
                throw new Error('El producto no existe en el carrito');
            }
            setTotalItems(prevTotal => prevTotal - productToRemove.quantity);
            return currentCart.filter(item => item.id !== productId);
        });
    // Ya no se sincroniza el carrito con la API
    };

    // Vaciar el carrito
    const clearCart = () => {
        setCart([]);
        setTotalItems(0);
    };

    // Calcular el total
    const calculateTotal = () => {
        return cart.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
    };

    // Checkout (sincronización con API pendiente)
    const checkout = async () => {
        // ...igual que antes, pendiente de integración API
        clearCart();
        return {
            success: true,
            total: calculateTotal()
        };
    };

    const value = {
        cart,
        setCart,
        totalItems,
        setTotalItems,
        addToCart,
        removeFromCart,
        clearCart,
        calculateTotal,
        checkout
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};
