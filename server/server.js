import "dotenv/config";
import app from "./src/app.js";
import { env } from "./src/config/env.js";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${env.PORT}`);
});