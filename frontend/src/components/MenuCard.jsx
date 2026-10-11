import { Link } from 'react-router-dom';
import { ShoppingCartIcon, StarIcon } from '@heroicons/react/24/solid';
import { FireIcon } from '@heroicons/react/24/outline';
import { useCartStore } from '../store/cartStore';
import toast from 'react-hot-toast';

export default function MenuCard({ item }) {
  const addItem = useCartStore(s => s.addItem);

  const handleAdd = () => {
    addItem({ id: item.id, name: item.name, price: item.price, imageUrl: item.imageUrl });
    toast.success(`${item.name} added to cart!`);
  };

  return (
    <div className="card group hover:shadow-md transition-shadow">
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">🍲</div>
        )}
        {item.spicyLevel > 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
            {Array.from({ length: item.spicyLevel }).map((_, i) => <FireIcon key={i} className="w-3 h-3" />)}
          </div>
        )}
        {item.isVegetarian && (
          <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">🌿 Veg</span>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between mb-1">
          <Link to={`/menu/${item.id}`} className="font-semibold text-gray-900 hover:text-brand-600">{item.name}</Link>
          <span className="font-bold text-brand-600">${parseFloat(item.price).toFixed(2)}</span>
        </div>
        {item.averageRating > 0 && (
          <div className="flex items-center gap-1 mb-2">
            <StarIcon className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-gray-500">{parseFloat(item.averageRating).toFixed(1)} ({item.reviewCount})</span>
          </div>
        )}
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">{item.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">⏱ {item.prepTimeMinutes} min</span>
          <button onClick={handleAdd} disabled={!item.isAvailable}
            className="flex items-center gap-1 btn-primary text-sm py-1.5">
            <ShoppingCartIcon className="w-4 h-4" /> Add
          </button>
        </div>
      </div>
    </div>
  );
}
