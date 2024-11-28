import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import SearchPage from './pages/SearchPage';
import CheckoutPage from './pages/CheckoutPage';
import Header from './components/Header';
import WishlistPage from './pages/WishlistPage';

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  
  return (
    <div className="max-w-7xl mx-auto px-4">
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <Routes>
        <Route path="/" element={<SearchPage searchTerm={searchTerm} />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
      </Routes>
    </div>
  );
}