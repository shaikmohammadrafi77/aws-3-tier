const Redis = require('ioredis');

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  tls: process.env.NODE_ENV === 'production' ? {} : undefined,
  retryStrategy: (times) => Math.min(times * 50, 2000),
  lazyConnect: true
});

redis.on('connect', () => console.log('✅ Redis connected'));
redis.on('error', (err) => console.error('❌ Redis error:', err));

const cache = {
  async get(key) {
    const val = await redis.get(key);
    return val ? JSON.parse(val) : null;
  },
  async set(key, value, ttlSeconds = 300) {
    await redis.setex(key, ttlSeconds, JSON.stringify(value));
  },
  async del(key) {
    await redis.del(key);
  },
  async flush(pattern) {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) await redis.del(...keys);
  }
};

module.exports = { redis, cache };
