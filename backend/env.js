import dotenv from 'dotenv';
dotenv.config();

const env={
    PORT: process.env.PORT || 4441,
    JWT_SECRET: process.env.JWT_SECRET,
    DATABASE_URL: process.env.DATABASE_URL
}

export default env;
