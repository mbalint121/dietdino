import express from "express";
import loginRouter from "../login/router";
import registrationRouter from "../registration/router";
import cors from "cors";
import passwordRouter from "../password/router";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/login", loginRouter);
app.use("/api/registration", registrationRouter);
app.use("/api/password", passwordRouter);

export default app;