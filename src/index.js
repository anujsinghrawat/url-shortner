import express from 'express';
import { router } from './routes/user.route.js';
import connectDB from './database/index.js';
import dotenv from 'dotenv';

const app = express();

dotenv.config(
    {
        path: ".env",
    }
)
app.use(express.json());
connectDB().
    then(() => {
        console.log("Connected to the database");
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT} and the started running on the link http://localhost:${process.env.PORT}`);
        });
    })
    .catch((error) => {
        console.log("Error connecting to the database", error);
        process.exit(1);
    });

app.use("/url", router);