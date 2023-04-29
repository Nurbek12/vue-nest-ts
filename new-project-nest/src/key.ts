import { config } from 'dotenv'

config()

export const serverport = process.env.PORT || 3001
export const host = process.env.DB_HOST
export const port = Number(process.env.DB_PORT)
export const username = process.env.DB_USER
export const password = process.env.DB_PASS
export const database = process.env.DB_NAME
export const secret = process.env.JWTKEY