import { Link } from 'react-router-dom';
import { HeartIcon, ShoppingCartIcon, UserIcon } from '@heroicons/react/24/outline';
import { ArrowsUpDownIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { useCart } from '../context/CartContext';

export default function Header({ searchTerm, setSearchTerm }) {
    const { cart, wishlist } = useCart();
    const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const wishlistCount = wishlist.length;

    return (
        <header className="sticky top-0 z-50 bg-white py-4 shadow-sm">
    <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center gap-4">
        <div className="w-full md:w-auto flex items-center justify-between md:justify-start">
            <Link to="/" className="text-2xl font-bold">
                GROCERIES
            </Link>
        </div>

        <div className="w-full max-w-2xl md:mx-auto">
            <div className="relative">
                <input
                    type="text"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-6 py-3 pr-24 rounded-full bg-white shadow-sm border border-gray-100 focus:outline-none"
                />
                <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center space-x-3">
                    {searchTerm && (
                        <button 
                            onClick={() => setSearchTerm('')}
                            className="text-blue-600"
                        >
                            <XMarkIcon className="w-5 h-5" />
                        </button>
                    )}
                    <ArrowsUpDownIcon className="w-5 h-5 text-gray-400" />
                </div>
            </div>
        </div>

        <div className="flex items-center gap-6">
            <Link to="/wishlist" className="relative">
                <HeartIcon className="w-6 h-6" />
                {wishlistCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                        {wishlistCount}
                    </span>
                )}
            </Link>
            <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                <UserIcon className="w-6 h-6 m-1" />
            </div>
            <Link to="/checkout" className="relative">
                <ShoppingCartIcon className="w-6 h-6" />
                {cartItemsCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                        {cartItemsCount}
                    </span>
                )}
            </Link>
        </div>
    </div>
</header>
    );
}