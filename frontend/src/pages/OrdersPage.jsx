import { useState, useEffect } from 'react';
import api from '../api/client';

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  preparing: 'bg-purple-100 text-purple-800',
  ready: 'bg-green-100 text-green-800',
  delivered: 'bg-gray-100 text-gray-600',
  cancelled: 'bg-red-100 text-red-600'
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders').then(r => setOrders(r.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-24"><div className="text-5xl animate-spin inline-block">⏳</div></div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>
      {orders.length === 0 ? (
        <div className="text-center py-24 text-gray-400">
          <div className="text-6xl mb-4">📋</div>
          <p className="text-xl">No orders yet</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order.id} className="card p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-lg">#{order.orderNumber}</h3>
                  <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[order.status]}`}>
                  {order.status.toUpperCase()}
                </span>
              </div>
              <div className="space-y-2 mb-4">
                {order.items?.map(oi => (
                  <div key={oi.id} className="flex justify-between text-sm">
                    <span>{oi.quantity}× {oi.menuItem?.name}</span>
                    <span className="font-medium">${parseFloat(oi.totalPrice).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-3 flex justify-between font-bold">
                <span>Total</span>
                <span className="text-brand-600">${parseFloat(order.total).toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
