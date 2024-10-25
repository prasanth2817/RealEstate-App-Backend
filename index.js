import express from "express"
import dotenv from "dotenv"
import cors from 'cors'
import AppRoutes from "./src/Routes/index.js"

dotenv.config();

const app = express();
const PORT= process.env.PORT || 8000

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(express.json())
app.use('/',AppRoutes)

app.listen(PORT,()=>console.log(`Server is listing to port ${PORT}`));