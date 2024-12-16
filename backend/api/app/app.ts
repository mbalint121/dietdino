import express from "express";
import cors from "cors";
import registrationRouter from "../registration/router";
import verificationRouter from "../verification/router";
import loginRouter from "../login/router";
import passwordRouter from "../password/router";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/registration", registrationRouter);
app.use("/api/verify", verificationRouter);
app.use("/api/login", loginRouter);
app.use("/api/password", passwordRouter);

export default app;