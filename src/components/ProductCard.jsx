import { ShoppingCartIcon, HeartIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { cart, addToCart, removeFromCart, toggleWishlist, isInWishlist } = useCart();
  // Find only non-free items for display
  const cartItem = cart.find(item => item.id === product.id && !item.isFree);
  const inWishlist = isInWishlist(product.id);

  // Calculate remaining inventory considering cart items and free items
  const getRemainingInventory = () => {
    const totalInCart = cart.reduce((total, item) => 
      item.id === product.id ? total + item.quantity : total, 
      0
    );
    return product.available - totalInCart;
  };

  const remainingInventory = getRemainingInventory();

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <img 
        src={product.img} 
        alt={product.name} 
        className="w-full h-48 object-contain" 
      />
      
      <div className="mt-4 space-y-2">
        <h3 className="font-semibold text-lg">{product.name}</h3>
        <p className="text-gray-500 text-sm">{product.description}</p>
        
        {remainingInventory <= 0 ? (
          <span className="inline-block bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm">
            Out of stock
          </span>
        ) : remainingInventory < 10 ? (
          <span className="inline-block bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm">
            Only {remainingInventory} left
          </span>
        ) : (
          <span className="inline-block bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm">
            Available
          </span>
        )}

        <div className="flex items-center justify-between pt-4">
          <span className="font-semibold">{product.price}</span>
          <div className="flex items-center gap-2">
            {cartItem && cartItem.quantity >= 1 ? (
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                <button 
                  onClick={() => removeFromCart(product.id)}
                  className="p-1 hover:bg-gray-200 rounded"
                  disabled={remainingInventory === product.available}
                >
                  <MinusIcon className="w-5 h-5" />
                </button>
                <span className="w-8 text-center">
                  {cartItem.quantity}
                </span>
                <button 
                  onClick={() => addToCart(product)}
                  className="p-1 hover:bg-gray-200 rounded"
                  disabled={remainingInventory <= 0}
                >
                  <PlusIcon className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => addToCart(product)}
                className="p-2 hover:bg-gray-100 rounded-lg"
                disabled={remainingInventory <= 0}
              >
                <ShoppingCartIcon className="w-6 h-6" />
              </button>
            )}
            <button 
              onClick={() => toggleWishlist(product)}
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
            >
              {inWishlist ? (
                <HeartSolidIcon className="w-6 h-6 text-red-500" />
              ) : (
                <HeartIcon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}