import app from "./app";
import dotenv from "dotenv";

dotenv.config();
const { PORT } = process.env;

app.listen(PORT, () => {
    console.log(`A szerver fut a következő porton: ${PORT}`);
});