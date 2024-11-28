// SearchPage.jsx
import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';

const CATEGORIES = ['All items', 'Drinks', 'Fruit', 'Bakery'];
const API_URL = 'https://uxdlyqjm9i.execute-api.eu-west-1.amazonaws.com/s';

const categoryToAPI = {
  'All items': 'all',
  'Drinks': 'drinks',
  'Fruit': 'fruit',
  'Bakery': 'bakery'
};

// New OffersPanel component
const OffersPanel = () => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
      <h2 className="text-xl font-semibold mb-4">Current Offers</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center gap-3 bg-green-50 p-4 rounded-lg">
          <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <span className="text-green-600 font-semibold">6+1</span>
          </div>
          <p className="text-gray-700">Buy 6 cans of Coca-Cola, get one free!</p>
        </div>
        <div className="flex items-center gap-3 bg-green-50 p-4 rounded-lg">
          <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <span className="text-green-600 font-semibold">3+1</span>
          </div>
          <p className="text-gray-700">Buy 3 croissants, get a free coffee!</p>
        </div>
      </div>
    </div>
  );
};

export default function SearchPage({ searchTerm }) {
  const [selectedCategory, setSelectedCategory] = useState('All items');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const apiCategory = categoryToAPI[selectedCategory];
        const response = await fetch(`${API_URL}?category=${apiCategory}`);
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory]);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div>Loading...</div>;

  return (
    <main className="py-4 md:py-8 px-4">
      <OffersPanel />

      <div className="flex overflow-x-auto hide-scrollbar gap-2 md:gap-4 mb-6 md:mb-8 -mx-4 px-4 md:mx-0">
        {CATEGORIES.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full whitespace-nowrap ${selectedCategory === category
                ? 'bg-black text-white'
                : 'bg-gray-100'
              }`}
          >
            {category}
          </button>
        ))}
      </div>

      <h2 className="text-xl font-semibold mb-4 md:mb-6">Trending Items</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
}