import dotenv from 'dotenv'
dotenv.config()

//development
const config = {
    CLOUD_NAME: 'dr00ghniy',
    API_KEY: '557786495727158',
    API_SECRET: 'Z5C30Zfk36osyKzxu3umcW1BpnM',
    MAX_AGE_ACCESS_TOKEN: '15m',
    MAX_AGE_REFRESH_TOKEN: '1d',
    REFRESH_TOKEN: 'himsi2',
    ACCESS_TOKEN: 'himsi',
    API_KEY_MAILCHIMP: '20344bcae626943c27ca8bcf8c331594-us14',
    ID_AUDIENCE: 'a8190bec4c',
    PORT: 8000,
    MONGO_URI: 'mongodb://0.0.0.0:27017/example',
    MONGO_URI: 'mongodb://fadilalfarisy:lelekuning@cluster0-shard-00-00.mnvpb.mongodb.net:27017,cluster0-shard-00-01.mnvpb.mongodb.net:27017,cluster0-shard-00-02.mnvpb.mongodb.net:27017/?ssl=true&replicaSet=atlas-aw3u78-shard-0&authSource=admin&retryWrites=true&w=majority'
}

//production
// const config = {
//     CLOUD_NAME: process.env.CLOUD_NAME,
//     API_KEY: process.env.API_KEY,
//     API_SECRET: process.env.API_SECRET,
//     MAX_AGE_ACCESS_TOKEN: process.env.MAX_AGE_ACCESS_TOKEN,
//     MAX_AGE_REFRESH_TOKEN: process.env.MAX_AGE_REFRESH_TOKEN,
//     REFRESH_TOKEN: process.env.REFRESH_TOKEN,
//     ACCESS_TOKEN: process.env.ACCESS_TOKEN,
//     API_KEY_MAILCHIMP: process.env.API_KEY_MAILCHIMP,
//     ID_AUDIENCE: process.env.ID_AUDIENCE,
//     PORT: process.env.PORT,
//     PREFIX_MAILCHIMP: process.env.PREFIX_MAILCHIMP,
//     MONGO_URI: process.env.MONGO_URI
// }

export default config