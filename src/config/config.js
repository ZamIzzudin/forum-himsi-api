import dotenv from 'dotenv'
dotenv.config()

//development
const config = {
    PORT: 8000,
    MONGO_URL: 'mongodb+srv://god:syahid11@creature.ydzmaly.mongodb.net/?retryWrites=true&w=majority',
    API_KEY: '557786495727158',
    API_SECRET: 'Z5C30Zfk36osyKzxu3umcW1BpnM',
    MAX_AGE_ACCESS_TOKEN: '15m',
    MAX_AGE_REFRESH_TOKEN: '1d',
    REFRESH_TOKEN: 'creation',
    ACCESS_TOKEN: 'creation',
}

export default config