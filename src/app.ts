import cors from "cors";
import express, { Application, NextFunction, Request, Response } from "express";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import routes from "./app/routes";
import httpStatus from "http-status";
import cookieParser from "cookie-parser";
const app: Application = express();

// cors use
app.use(cors());

// use cookies parser
app.use(cookieParser());

// Parsing data
app.use(express.json());
app.use(express.urlencoded());

app.use("/api/v1", routes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use(globalErrorHandler);

//handle not found
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: "Api Not Found",
    errorMessages: [
      {
        path: req.originalUrl,
        message: "API Not Found",
      },
    ],
  });
  next();
});

export default app;
