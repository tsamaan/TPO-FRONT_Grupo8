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

    // Agregar producto al carrito (ahora maneja variantes por SKU)
    const addToCart = (product, quantity = 1) => {
        setCart(currentCart => {
            // Buscar por SKU si existe, sino por ID
            const itemKey = product.sku || product.id;
            const existingProductIndex = currentCart.findIndex(item => 
                (item.sku && item.sku === itemKey) || 
                (!item.sku && item.id === product.id)
            );
            
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
                // Agregar nuevo item con un ID unico para el carrito
                return [...currentCart, { 
                    ...product, 
                    quantity,
                    cartItemId: product.sku || `${product.id}-${Date.now()}`
                }];
            } else {
                return currentCart;
            }
        });
        setTotalItems(prevTotal => Math.max(prevTotal + quantity, 0));
    };

    // Eliminar producto del carrito (ahora busca por SKU o ID)
    const removeFromCart = (productIdentifier) => {
        setCart(currentCart => {
            const productToRemove = currentCart.find(item => 
                item.sku === productIdentifier || 
                item.id === productIdentifier ||
                item.cartItemId === productIdentifier
            );
            if (!productToRemove) {
                throw new Error('El producto no existe en el carrito');
            }
            setTotalItems(prevTotal => prevTotal - productToRemove.quantity);
            return currentCart.filter(item => 
                item.sku !== productIdentifier && 
                item.id !== productIdentifier &&
                item.cartItemId !== productIdentifier
            );
        });
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

    // Checkout (sincronizacion con API pendiente)
    const checkout = async () => {
        // ...igual que antes, pendiente de integracion API
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
