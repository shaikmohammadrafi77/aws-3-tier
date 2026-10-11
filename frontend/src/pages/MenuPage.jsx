import { useState, useEffect, useCallback } from 'react';
import api from '../api/client';
import MenuCard from '../components/MenuCard';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function MenuPage() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCat, setSelectedCat] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchMenu = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 12 };
      if (selectedCat) params.category = selectedCat;
      if (search) params.search = search;
      const { data } = await api.get('/menu', { params });
      setItems(data.items);
      setTotalPages(data.pages);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [selectedCat, search, page]);

  useEffect(() => { api.get('/categories').then(r => setCategories(r.data)); }, []);
  useEffect(() => { fetchMenu(); }, [fetchMenu]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Our Menu</h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input className="input pl-10" placeholder="Search dishes..." value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }} />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => { setSelectedCat(''); setPage(1); }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${!selectedCat ? 'bg-brand-500 text-white' : 'bg-white border border-gray-200 text-gray-600'}`}>
            All
          </button>
          {categories.map(c => (
            <button key={c.id} onClick={() => { setSelectedCat(c.id); setPage(1); }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCat === c.id ? 'bg-brand-500 text-white' : 'bg-white border border-gray-200 text-gray-600'}`}>
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="card h-72 animate-pulse bg-gray-100" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-24 text-gray-400">
          <div className="text-6xl mb-4">🍽️</div>
          <p className="text-xl">No items found</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map(item => <MenuCard key={item.id} item={item} />)}
          </div>
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button key={i} onClick={() => setPage(i + 1)}
                  className={`w-9 h-9 rounded-full text-sm font-medium ${page === i + 1 ? 'bg-brand-500 text-white' : 'bg-white border border-gray-200'}`}>{i + 1}</button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
