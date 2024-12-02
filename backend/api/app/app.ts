import express from "express";
import loginRouter from "../login/router";
import registrationRouter from "../registration/router";

const app = express();

app.use(express.json());
app.use("/api/login", loginRouter);
app.use("/api/registration", registrationRouter);

export default app;