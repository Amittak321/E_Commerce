import dotenv from 'dotenv';

dotenv.config();

const config = {
    JWT_SCRET: process.env.JWT_SCRET,
    JWT_EXPIRY: process.env.JWT_EXPIRY || '30d',
}

export default config;