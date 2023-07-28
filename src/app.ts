import compression from "compression";
import cors from "cors";
import express, { Application, Request, Response } from "express";
import helmet from "helmet";
import hpp from "hpp";
import { connect, set } from "mongoose";
import swaggerUi from "swagger-ui-express";
import { RegisterRoutes } from "./build/routes";
import logger from "./shared/commons/logger";
import { NODE_ENV, ORIGIN, PORT } from "./shared/configs/config";
import { databaseConnection } from "./shared/configs/database";
import errorMiddleware from "./shared/middlewares/error.middleware";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const swagger = require("./build/swagger.json");

class App {
  public app: Application;
  public env: string;
  public port: string;

  constructor() {
    this.app = express();
    this.env = NODE_ENV || "development";
    this.port = PORT || "3000";

    this.connectToDatabase();
    this.initMiddlewares();
    this.initRoutes();
    this.initErrorHandling();
  }

  private connectToDatabase() {
    set("strictQuery", false);
    if (this.env !== "production") {
      set("debug", false);
    }
    try {
      connect(databaseConnection.url, databaseConnection.options);
      logger.info("database connected");
    } catch (e) {
      logger.info("database not connected");
    }
  }

  private initMiddlewares() {
    // cors handler
    this.app.use(
      cors({
        origin: ORIGIN,
        allowedHeaders: ["Content-Type", "Authorization"],
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        credentials: true,
      })
    );
    this.app.use(express.json()); // for receiving json payload
    this.app.use(express.urlencoded({ extended: true })); // for receiving form data
    this.app.use(helmet()); // for prevent security attack
    this.app.use(compression()); // for compressing data before sent to client
    this.app.use(hpp()); // for cleaning ambiguous parameters
  }

  private initRoutes() {
    this.app.use(
      "/docs",
      swaggerUi.serve,
      async (_req: Request, res: Response) => {
        return res.send(swaggerUi.generateHTML(swagger));
      }
    );

    RegisterRoutes(this.app);
  }

  private initErrorHandling() {
    this.app.use(errorMiddleware);
  }

  public listen() {
    this.app.listen(this.port, () => {
      logger.info(`Listening at http://localhost:${this.port}/api`);
    });
    this.app.on("error", console.error);
  }
}

export default App;
