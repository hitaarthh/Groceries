import { createContext, useContext, useState } from 'react';

const CartContext = createContext();

// Product and Offer Constants
const PRODUCT_IDS = {
    COKE: 642,
    CROISSANT: 532,
    COFFEE: 641
};

const OFFERS = {
    COKE: {
        requiredQuantity: 6,
        freeName: 'Coca-Cola (Free with every 6)'
    },
    CROISSANT: {
        requiredQuantity: 3,
        freeName: 'Coffee (Free with 3 Croissants)'
    }
};

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

                return applyOffers(newCart);
            }

            // Add new item
            const newCart = [...prevCart, { ...product, quantity: 1 }];
            return applyOffers(newCart);
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
            const item = prevCart.find(item => item.id === productId && !item.isFree);

            if (!item) return prevCart;

            // Handle both Coke and Coffee inventory checks
            if (productId === PRODUCT_IDS.COKE) {
                const freeCokes = Math.floor(newQuantity / OFFERS.COKE.requiredQuantity);
                const totalQuantity = newQuantity + freeCokes;
                if (totalQuantity > item.available) return prevCart;
            } else if (productId === PRODUCT_IDS.COFFEE) {
                // Check if we can accommodate both paid and potential free coffees
                const croissantItem = prevCart.find(item => item.id === PRODUCT_IDS.CROISSANT);
                const freeCoffees = croissantItem ? Math.floor(croissantItem.quantity / OFFERS.CROISSANT.requiredQuantity) : 0;
                const totalQuantity = newQuantity + freeCoffees;
                if (totalQuantity > item.available) return prevCart;
            } else {
                if (newQuantity > item.available) return prevCart;
            }

            const newCart = prevCart.map(cartItem =>
                cartItem.id === productId && !cartItem.isFree
                    ? { ...cartItem, quantity: newQuantity }
                    : cartItem
            );

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

    const applyOffers = (cart) => {
        let updatedCart = [...cart];

        // Handle Coca-Cola offer
        const cokeItem = updatedCart.find(item => item.id === PRODUCT_IDS.COKE && !item.isFree);
        if (cokeItem) {
            // Remove any existing free cokes
            updatedCart = updatedCart.filter(item => !(item.id === PRODUCT_IDS.COKE && item.isFree));

            const freeCokes = Math.floor(cokeItem.quantity / OFFERS.COKE.requiredQuantity);
            // Calculate total items (purchased + potential free)
            const totalItems = cokeItem.quantity + freeCokes;

            // Only add free cokes if we're within inventory limit
            if (freeCokes > 0 && totalItems <= cokeItem.available) {
                updatedCart.push({
                    ...cokeItem,
                    name: OFFERS.COKE.freeName,
                    quantity: freeCokes,
                    isFree: true,
                    price: '£0.00'
                });
            }
        }

        // Handle Croissant/Coffee offer
        const croissantItem = updatedCart.find(item => item.id === PRODUCT_IDS.CROISSANT);
        if (croissantItem) {
            // Remove any existing free coffees
            updatedCart = updatedCart.filter(item => !(item.id === PRODUCT_IDS.COFFEE && item.isFree));

            const freeCoffees = Math.floor(croissantItem.quantity / OFFERS.CROISSANT.requiredQuantity);

            const coffeeInCart = updatedCart.find(item =>
                item.id === PRODUCT_IDS.COFFEE && !item.isFree
            );

            const totalCoffees = (coffeeInCart ? coffeeInCart.quantity : 0) + freeCoffees;
            const availableLimit = coffeeInCart ? coffeeInCart.available : 10;

            if (freeCoffees > 0 && totalCoffees <= availableLimit) {
                updatedCart.push({
                    id: PRODUCT_IDS.COFFEE,
                    name: OFFERS.CROISSANT.freeName,
                    img: 'https://py-shopping-cart.s3.eu-west-2.amazonaws.com/coffee.jpeg',
                    quantity: freeCoffees,
                    isFree: true,
                    price: '£0.00',
                    available: availableLimit
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