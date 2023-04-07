import express  from "express";
import cookieParser from "cookie-parser";
import cors from 'cors';
import morgan from 'morgan';

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());
app.use(cookieParser());

app.use(morgan('combined'));

export default app;