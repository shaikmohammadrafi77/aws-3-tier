import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCartIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const items = useCartStore(s => s.items);
  const count = items.reduce((s, i) => s + i.qty, 0);
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🍽️</span>
            <span className="font-bold text-xl text-brand-600">Savoria</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/menu" className="text-gray-600 hover:text-brand-600 font-medium transition-colors">Menu</Link>
            {user && <Link to="/orders" className="text-gray-600 hover:text-brand-600 font-medium transition-colors">Orders</Link>}
            {user?.role === 'admin' && <Link to="/admin" className="text-brand-600 font-semibold">Admin</Link>}
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Link to="/cart" className="relative p-2 text-gray-600 hover:text-brand-600">
                  <ShoppingCartIcon className="w-6 h-6" />
                  {count > 0 && (
                    <span className="absolute -top-1 -right-1 bg-brand-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{count}</span>
                  )}
                </Link>
                <div className="flex items-center gap-2">
                  <UserCircleIcon className="w-6 h-6 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">{user.name}</span>
                  <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-red-500 ml-2">Logout</button>
                </div>
              </>
            ) : (
              <div className="flex gap-2">
                <Link to="/login" className="btn-secondary text-sm">Login</Link>
                <Link to="/register" className="btn-primary text-sm">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
