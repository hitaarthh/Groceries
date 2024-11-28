import { useCart } from './context/CartContext';

export default function CartSummary() {
  const { cart, calculateTotals } = useCart();
  const { subtotal, discount, total, offers } = calculateTotals();

  if (cart.length === 0) {
    return (
      <div className="p-6 bg-white rounded-xl shadow-sm">
        <p>Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Cart Summary</h2>
      
      <div className="space-y-4">
        {cart.map(item => (
          <div key={item.id} className="flex justify-between">
            <span>{item.name} x{item.quantity}</span>
            <span>£{(Number(item.price.replace('£', '')) * item.quantity).toFixed(2)}</span>
          </div>
        ))}

        {offers.length > 0 && (
          <div className="pt-4 border-t">
            <h3 className="font-medium mb-2">Applied Offers</h3>
            {offers.map((offer, index) => (
              <div key={index} className="text-green-600">
                {offer.description} (-£{offer.value.toFixed(2)})
              </div>
            ))}
          </div>
        )}

        <div className="pt-4 border-t space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>£{subtotal.toFixed(2)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span>-£{discount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>£{total.toFixed(2)}</span>
          </div>
        </div>

        <button className="w-full mt-4 bg-black text-white py-2 rounded-lg">
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}