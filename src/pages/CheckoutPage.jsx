import { useCart } from '../context/CartContext';

export default function CheckoutPage() {
    const { cart, calculateTotals, updateQuantity, removeFromCart } = useCart();
    const { subtotal, discount, total } = calculateTotals();

    return (
        <div className="min-h-screen bg-white">
            <div className="px-4 py-6">
                <h2 className="text-3xl">Checkout</h2>
            </div>

            <div className="px-4">
                <div className="space-y-8">
                    {cart.map(item => (
                        <div key={item.id} className="flex items-center justify-between">
                            <div className="flex gap-4">
                                <img 
                                    src={item.img} 
                                    alt={item.name} 
                                    className="w-12 h-12 object-contain"
                                />
                                <div>
                                    <h4 className="text-lg">{item.name}</h4>
                                    <p className="text-gray-500 text-sm">code: {item.id}</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center">
                                {!item.isFree ? (
                                    // Only show quantity controls for non-free items
                                    <>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full text-gray-600"
                                        >
                                            -
                                        </button>
                                        <span className="w-8 text-center">
                                            {item.quantity}
                                        </span>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full text-gray-600"
                                        >
                                            +
                                        </button>
                                    </>
                                ) : (
                                    // Just show quantity for free items
                                    <span className="w-8 text-center">
                                        {item.quantity}
                                    </span>
                                )}
                                <span className="ml-4 w-16 text-right">
                                    £{(Number(item.price.replace('£', '')) * item.quantity).toFixed(2)}
                                </span>
                                {!item.isFree && (
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="ml-4 text-gray-400"
                                    >
                                        ×
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}

                    <div className="space-y-4 pt-8">
                        <div className="flex justify-between text-lg">
                            <span>Subtotal</span>
                            <span>£{subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-lg text-gray-500">
                            <span>Discount</span>
                            <span>£{discount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-xl font-normal pt-4 border-t">
                            <span>Total</span>
                            <span>£{total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white">
                <button className="w-full bg-green-500 hover:bg-green-600 text-white py-4 text-lg font-normal rounded-xl">
                    Checkout
                </button>
            </div>

            <div className="h-20" />
        </div>
    );
}