const Redis = require('ioredis');
const logger = require('../config/logger');

let redis = null;
let memoryCache = new Map();

// Try to connect to Redis, otherwise fallback to in-memory cache
if (process.env.REDIS_URL || process.env.REDIS_HOST) {
  try {
    redis = new Redis(process.env.REDIS_URL || {
      host: process.env.REDIS_HOST || '127.0.0.1',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      maxRetriesPerRequest: 1,
    });

    redis.on('error', (err) => {
      logger.warn('Redis connection error, falling back to in-memory cache:', err.message);
      redis = null;
    });

    redis.on('connect', () => {
      logger.info('Connected to Redis successfully');
    });
  } catch (err) {
    logger.warn('Failed to initialize Redis, using in-memory cache:', err.message);
    redis = null;
  }
} else {
  logger.info('No Redis configuration found. Using in-memory cache service.');
}

const cacheService = {
  get: async (key) => {
    if (redis) {
      try {
        const val = await redis.get(key);
        if (val) {
          logger.debug(`[CACHE HIT] Key: ${key}`);
          return JSON.parse(val);
        }
      } catch (err) {
        logger.error(`Redis get error for key ${key}:`, err.message);
      }
    }

    // In-memory fallback
    const val = memoryCache.get(key);
    if (val) {
      // Check expiry
      if (val.expiry && val.expiry < Date.now()) {
        memoryCache.delete(key);
        logger.debug(`[CACHE EXPIRED] Key: ${key}`);
        return null;
      }
      logger.debug(`[CACHE HIT - MEMORY] Key: ${key}`);
      return val.data;
    }

    logger.debug(`[CACHE MISS] Key: ${key}`);
    return null;
  },

  set: async (key, data, ttlSeconds = 300) => {
    if (redis) {
      try {
        await redis.set(key, JSON.stringify(data), 'EX', ttlSeconds);
        logger.debug(`[CACHE SET] Key: ${key} (TTL: ${ttlSeconds}s)`);
        return;
      } catch (err) {
        logger.error(`Redis set error for key ${key}:`, err.message);
      }
    }

    // In-memory fallback
    memoryCache.set(key, {
      data,
      expiry: Date.now() + ttlSeconds * 1000,
    });
    logger.debug(`[CACHE SET - MEMORY] Key: ${key} (TTL: ${ttlSeconds}s)`);
  },

  del: async (key) => {
    if (redis) {
      try {
        await redis.del(key);
        logger.debug(`[CACHE DEL] Key: ${key}`);
        return;
      } catch (err) {
        logger.error(`Redis del error for key ${key}:`, err.message);
      }
    }

    // In-memory fallback
    memoryCache.delete(key);
    logger.debug(`[CACHE DEL - MEMORY] Key: ${key}`);
  },

  // Invalidate cache by pattern/prefix (e.g. invalidate all product page caches)
  delByPrefix: async (prefix) => {
    logger.info(`[CACHE INVALIDATE] Prefix: ${prefix}`);
    if (redis) {
      try {
        const keys = await redis.keys(`${prefix}*`);
        if (keys.length > 0) {
          await redis.del(...keys);
        }
        return;
      } catch (err) {
        logger.error(`Redis delByPrefix error for prefix ${prefix}:`, err.message);
      }
    }

    // In-memory fallback
    for (const key of memoryCache.keys()) {
      if (key.startsWith(prefix)) {
        memoryCache.delete(key);
      }
    }
  },

  flush: async () => {
    if (redis) {
      try {
        await redis.flushall();
        logger.debug('[CACHE FLUSHED]');
        return;
      } catch (err) {
        logger.error('Redis flushall error:', err.message);
      }
    }

    memoryCache.clear();
    logger.debug('[CACHE FLUSHED - MEMORY]');
  },
};

module.exports = cacheService;
