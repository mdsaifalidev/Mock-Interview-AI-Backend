import redis from "./redis.js"

const UserRolesEnum = {
  ADMIN: "admin",
  USER: "user",
}

const UserRoles = Object.values(UserRolesEnum)

const DifficultyLevelsEnum = {
  EASY: "easy",
  MEDIUM: "medium",
  HARD: "hard",
}

const DifficultyLevels = Object.values(DifficultyLevelsEnum)

const NoOfQuestionsEnum = {
  FIVE: 5,
  TEN: 10,
  FIFTEEN: 15,
}

const NoOfQuestions = Object.values(NoOfQuestionsEnum)

// *Cookie options
const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  path: "/",
}

// *Set data to redis
const setDataToRedis = async (key, value, expireTime) => {
  await redis.set(key, JSON.stringify(value), "EX", expireTime)
}

// *Get data from redis
const getDataFromRedis = async (key) => {
  const data = await redis.get(key)
  return JSON.parse(data)
}

// *Delete data from redis
const deleteDataFromRedis = async (key) => {
  await redis.del(key)
}

export {
  cookieOptions,
  UserRoles,
  UserRolesEnum,
  DifficultyLevels,
  DifficultyLevelsEnum,
  NoOfQuestions,
  NoOfQuestionsEnum,
  setDataToRedis,
  getDataFromRedis,
  deleteDataFromRedis,
}
