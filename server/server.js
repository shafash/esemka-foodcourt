import dotenv from "dotenv";
import app from "./src/app.js";
import { env } from "./src/config/env.js"; 

dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${env.PORT}`);
});