import { Link } from 'react-router-dom';

const FEATURES = [
  { icon: '🚀', title: 'Fast Delivery', desc: 'Hot food at your door in 30 minutes or less.' },
  { icon: '👨‍🍳', title: 'Expert Chefs', desc: 'Award-winning recipes crafted with love.' },
  { icon: '🌿', title: 'Fresh Ingredients', desc: 'Locally sourced produce every day.' },
  { icon: '📱', title: 'Easy Ordering', desc: 'Order in seconds from any device.' }
];

export default function HomePage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-brand-600 to-brand-900 text-white py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
            Exquisite Dining,<br />Delivered to You
          </h1>
          <p className="text-xl text-orange-100 mb-10 max-w-2xl mx-auto">
            From our kitchen to your table — explore a world of flavour with Savoria.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/menu"
              className="px-8 py-4 bg-white text-brand-600 font-bold rounded-2xl hover:bg-orange-50 transition-colors text-lg">
              Browse Menu
            </Link>
            <Link to="/register"
              className="px-8 py-4 border-2 border-white text-white font-bold rounded-2xl hover:bg-white/10 transition-colors text-lg">
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Why Choose Savoria?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {FEATURES.map(f => (
            <div key={f.title} className="text-center p-6 card hover:shadow-md transition-shadow">
              <div className="text-5xl mb-4">{f.icon}</div>
              <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-50 py-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Order?</h2>
          <p className="text-gray-600 mb-8">Join thousands of food lovers enjoying Savoria every day.</p>
          <Link to="/menu" className="btn-primary text-lg px-8 py-3 inline-block">Explore Menu →</Link>
        </div>
      </section>
    </main>
  );
}
