import { createContext, useContext, useState } from 'react';

const CartContext = createContext();

const COKE_ID = 642;
const CROISSANT_ID = 532;
const COFFEE_ID = 641;

//Helper function for inventory management
const getTotalQuantity = (cart, productId) => {
    return cart.reduce((total, item) =>
        item.id === productId ? total + item.quantity : total,
        0
    );
};

export function CartProvider({ children }) {
    const [cart, setCart] = useState([]);
    const [wishlist, setWishlist] = useState([]);

    const addToCart = (product) => {
        setCart(prevCart => {
            // Check total quantity including free items
            const totalQuantity = getTotalQuantity(prevCart, product.id);
            if (totalQuantity >= product.available) return prevCart;

            // Find existing non-free item
            const existingItem = prevCart.find(item =>
                item.id === product.id && !item.isFree
            );

            if (existingItem) {
                const newCart = prevCart.map(item =>
                    item.id === product.id && !item.isFree
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );

                return applyOffers(newCart, product.available);
            }

            // Add new item
            const newCart = [...prevCart, { ...product, quantity: 1 }];
            return applyOffers(newCart, product.available);
        });
    };

    const removeFromCart = (productId) => {
        setCart(prevCart => {
            // Only remove/update non-free items
            const item = prevCart.find(item => item.id === productId && !item.isFree);
            if (!item) return prevCart;

            let newCart;
            if (item.quantity > 1) {
                newCart = prevCart.map(cartItem =>
                    cartItem.id === productId && !cartItem.isFree
                        ? { ...cartItem, quantity: cartItem.quantity - 1 }
                        : cartItem
                );
            } else {
                newCart = prevCart.filter(cartItem =>
                    cartItem.id !== productId || cartItem.isFree
                );
            }

            return applyOffers(newCart);
        });
    };

    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity < 1) {
            removeFromCart(productId);
            return;
        }
    
        setCart(prevCart => {
            // Find the item but specifically check if it's not a free item
            const item = prevCart.find(item => item.id === productId && !item.isFree);
            
            if (!item) return prevCart;
    
            // For Coca-Cola, check total quantity including potential free items
            if (productId === COKE_ID) {
                const freeCokes = Math.floor(newQuantity / 6);
                const totalQuantity = newQuantity + freeCokes;
                if (totalQuantity > 10) return prevCart;
            } else {
                // For other items, check just the new quantity
                if (newQuantity > item.available) return prevCart;
            }
    
            // Update quantity only for non-free items
            const newCart = prevCart.map(cartItem =>
                cartItem.id === productId && !cartItem.isFree
                    ? { ...cartItem, quantity: newQuantity }
                    : cartItem
            );
    
            // Apply offers after updating the quantity
            return applyOffers(newCart);
        });
    };

    const toggleWishlist = (product) => {
        setWishlist(prevWishlist => {
            const exists = prevWishlist.find(item => item.id === product.id);
            if (exists) {
                return prevWishlist.filter(item => item.id !== product.id);
            }
            return [...prevWishlist, product];
        });
    };

    const isInWishlist = (productId) => {
        return wishlist.some(item => item.id === productId);
    };

    const clearWishlist = () => {
        setWishlist([]);
    };

    const moveToCart = (productId) => {
        const product = wishlist.find(item => item.id === productId);
        if (product) {
            addToCart(product);
            toggleWishlist(product);
        }
    };

    const applyOffers = (cart, availableInventory) => {
        let updatedCart = [...cart];

        // Handle Coca-Cola offer
        const cokeItem = updatedCart.find(item => item.id === COKE_ID && !item.isFree);
        if (cokeItem) {
            // Remove any existing free cokes
            updatedCart = updatedCart.filter(item => !(item.id === COKE_ID && item.isFree));

            const freeCokes = Math.floor(cokeItem.quantity / 6);
            // Calculate total items (purchased + potential free)
            const totalItems = cokeItem.quantity + freeCokes;

            // Only add free cokes if we're within inventory limit
            if (freeCokes > 0 && totalItems <= 10) {
                updatedCart.push({
                    ...cokeItem,
                    name: 'Coca-Cola (Free with every 6)',
                    quantity: freeCokes,
                    isFree: true,
                    price: '£0.00'
                });
            }
        }

        // Handle Croissant offer
        const croissantItem = updatedCart.find(item => item.id === CROISSANT_ID);
        // Remove any existing free coffees before calculating new ones
        updatedCart = updatedCart.filter(item => !(item.id === COFFEE_ID && item.isFree));

        if (croissantItem && croissantItem.quantity >= 3) {
            const totalCoffeeQuantity = getTotalQuantity(updatedCart, COFFEE_ID);
            const maxFreeCoffees = Math.min(
                Math.floor(croissantItem.quantity / 3),  // Free coffees from offer rule
                10 - totalCoffeeQuantity                 // Available inventory limit
            );

            const coffeeReference = updatedCart.find(item => item.id === COFFEE_ID && !item.isFree) || {
                id: COFFEE_ID,
                name: 'Coffee (Free with 3 Croissants)',
                img: 'https://py-shopping-cart.s3.eu-west-2.amazonaws.com/coffee.jpeg',
                price: '£0.00',
                isFree: true
            };

            if (maxFreeCoffees > 0) {
                updatedCart.push({
                    ...coffeeReference,
                    name: 'Coffee (Free with 3 Croissants)',
                    quantity: maxFreeCoffees,
                    isFree: true,
                    price: '£0.00'
                });
            }
        }

        return updatedCart;
    };

    const calculateTotals = () => {
        const subtotal = cart
            .filter(item => !item.isFree)
            .reduce((sum, item) => sum + (Number(item.price.replace('£', '')) * item.quantity), 0);

        const offers = cart
            .filter(item => item.isFree)
            .map(item => ({
                description: item.description,
                value: 0
            }));

        return {
            subtotal,
            discount: 0,
            total: subtotal,
            offers
        };
    };

    return (
        <CartContext.Provider value={{
            cart,
            wishlist,
            addToCart,
            removeFromCart,
            updateQuantity,
            calculateTotals,
            toggleWishlist,
            isInWishlist,
            clearWishlist,
            moveToCart
        }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used within a CartProvider');
    return context;
};