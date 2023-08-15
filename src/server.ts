/* eslint-disable no-console */
import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import config from "./config";

process.on("uncaughtException", error => {
  console.log(error);
  process.exit(1);
});

let server: Server;

async function bootstrap() {
  try {
    await mongoose.connect(config.database_url as string);
    console.log(`Database is Connected Successfully! ✅📦✅`);

    server = app.listen(config.port, () => {
      console.log(`Server is app listening on port ${config.port} 🫀✅🫀`);
    });
  } catch (err) {
    console.log("❌❗❌❗❌ Database connection failed❗ error:- " + err);
  }

  process.on("unhandledRejection", error => {
    if (server) {
      server.close(() => {
        console.log(error);
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  });
}

bootstrap();

process.on("SIGTERM", () => {
  console.log("SIGTERM is received");

  if (server) {
    server.close();
  }
});
