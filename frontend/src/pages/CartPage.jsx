import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrashIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useCartStore } from '../store/cartStore';
import api from '../api/client';
import toast from 'react-hot-toast';

export default function CartPage() {
  const { items, removeItem, updateQty, clearCart } = useCartStore();
  const [orderType, setOrderType] = useState('dine_in');
  const [tableNumber, setTableNumber] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const subtotal = items.reduce((s, i) => s + parseFloat(i.price) * i.qty, 0);
  const tax = subtotal * 0.08;
  const deliveryFee = orderType === 'delivery' ? 3.99 : 0;
  const total = subtotal + tax + deliveryFee;

  const handleOrder = async () => {
    if (items.length === 0) return;
    setLoading(true);
    try {
      await api.post('/orders', {
        items: items.map(i => ({ menuItemId: i.id, quantity: i.qty })),
        type: orderType,
        tableNumber: orderType === 'dine_in' ? tableNumber : undefined,
        deliveryAddress: orderType === 'delivery' ? address : undefined
      });
      clearCart();
      toast.success('Order placed successfully!');
      navigate('/orders');
    } catch (e) {
      toast.error(e.response?.data?.error || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <div className="text-7xl mb-6">🛒</div>
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <button onClick={() => navigate('/menu')} className="btn-primary">Browse Menu</button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(item => (
            <div key={item.id} className="card p-4 flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                {item.imageUrl ? <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-3xl">🍲</div>}
              </div>
              <div className="flex-1">
                <p className="font-semibold">{item.name}</p>
                <p className="text-brand-600 font-medium">${parseFloat(item.price).toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => updateQty(item.id, item.qty - 1)} className="p-1 rounded-full bg-gray-100 hover:bg-gray-200"><MinusIcon className="w-4 h-4" /></button>
                <span className="w-8 text-center font-medium">{item.qty}</span>
                <button onClick={() => updateQty(item.id, item.qty + 1)} className="p-1 rounded-full bg-gray-100 hover:bg-gray-200"><PlusIcon className="w-4 h-4" /></button>
              </div>
              <p className="w-20 text-right font-bold">${(parseFloat(item.price) * item.qty).toFixed(2)}</p>
              <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-600"><TrashIcon className="w-5 h-5" /></button>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="card p-6 h-fit">
          <h2 className="font-bold text-lg mb-4">Order Summary</h2>
          
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700 block mb-2">Order Type</label>
            <div className="flex gap-2">
              {[['dine_in', '🪑 Dine In'], ['takeaway', '🥡 Takeaway'], ['delivery', '🚗 Delivery']].map(([v, l]) => (
                <button key={v} onClick={() => setOrderType(v)}
                  className={`flex-1 py-2 text-xs rounded-lg border transition-colors ${orderType === v ? 'bg-brand-500 border-brand-500 text-white' : 'border-gray-200 text-gray-600'}`}>{l}</button>
              ))}
            </div>
          </div>

          {orderType === 'dine_in' && (
            <input className="input mb-4" placeholder="Table number" value={tableNumber} onChange={e => setTableNumber(e.target.value)} />
          )}
          {orderType === 'delivery' && (
            <textarea className="input mb-4" rows={3} placeholder="Delivery address" value={address} onChange={e => setAddress(e.target.value)} />
          )}

          <div className="space-y-2 text-sm border-t pt-4 mb-4">
            <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Tax (8%)</span><span>${tax.toFixed(2)}</span></div>
            {deliveryFee > 0 && <div className="flex justify-between"><span>Delivery</span><span>${deliveryFee.toFixed(2)}</span></div>}
            <div className="flex justify-between font-bold text-base border-t pt-2">
              <span>Total</span><span className="text-brand-600">${total.toFixed(2)}</span>
            </div>
          </div>

          <button onClick={handleOrder} disabled={loading} className="btn-primary w-full py-3">
            {loading ? 'Placing Order...' : 'Place Order'}
          </button>
        </div>
      </div>
    </div>
  );
}
