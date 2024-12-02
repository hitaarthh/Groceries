import { ShoppingCartIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useCart } from '../context/CartContext';

export default function WishlistPage() {
  const { wishlist, moveToCart, toggleWishlist, cart } = useCart();

  // Helper function to calculate remaining inventory
  const getRemainingInventory = (product) => {
    const totalInCart = cart.reduce((total, item) => 
      item.id === product.id ? total + item.quantity : total, 
      0
    );
    return product.available - totalInCart;
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">My Wishlist ({wishlist.length} items)</h1>
      
      {wishlist.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Your wishlist is empty</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map(product => {
            const remainingInventory = getRemainingInventory(product);
            
            return (
              <div key={product.id} className="bg-white rounded-xl p-6 shadow-sm">
                <img src={product.img} alt={product.name} className="w-full h-48 object-contain" />
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
                  
                  <span className="font-semibold block">{product.price}</span>
                  
                  <div className="flex gap-2 pt-4">
                    <button
                      onClick={() => moveToCart(product.id)}
                      disabled={remainingInventory <= 0}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg ${
                        remainingInventory <= 0 
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                          : 'bg-blue-500 text-white hover:bg-blue-600'
                      }`}
                    >
                      <ShoppingCartIcon className="w-5 h-5" />
                      Move to Cart
                    </button>
                    <button
                      onClick={() => toggleWishlist(product)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}