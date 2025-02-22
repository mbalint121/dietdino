import express from "express";
import cors from "cors";
import registrationRouter from "../registration/router";
import verificationRouter from "../verification/router";
import authRouter from "../auth/router";
import passwordRouter from "../password/router";
import userRouter from "../user/router";
import recipeRouter from "../recipe/router";
import commodityRouter from "../commodity/router";
import commentRouter from "../comment/router";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/registration", registrationRouter);
app.use("/api/verify", verificationRouter);
app.use("/api/auth", authRouter);
app.use("/api/password", passwordRouter);
app.use("/api/users", userRouter);
app.use("/api/recipes", recipeRouter);
app.use("/api/commodities", commodityRouter);
app.use("/api/comments", commentRouter);

export default app;