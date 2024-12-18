import Redis from "ioredis"

// *Create a redis client
const redis = new Redis(process.env.REDIS_URL)

export default redis