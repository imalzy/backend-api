// src/routes/index.ts
import express from "express";
import todoRouter from "./todo/todo.route";
const router = express.Router();

router.use("/v1/todo", todoRouter);

export default router;
