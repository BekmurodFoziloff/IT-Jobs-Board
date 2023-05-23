import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import logger from './lib/logger';
import morganMiddleware from './middlewares/morgan.middleware';
import errorHandler from './middlewares/errorHandler.middleware';
import pathNotFound from './middlewares/pathNotFound.middleware';
import Controller from './interfaces/controller.interface';

class App {
  public app: express.Application;

  constructor(controllers: Controller[]) {
    this.app = express();
    this.setConfig();
    this.setMongoConfig();
    this.setControllers(controllers);
    this.setErrorHandlingMiddleware();
  }

  public listen() {
    this.app.listen(process.env.PORT, () => {
      logger.info(`App listening on the port ${process.env.PORT}`);
    });
  }

  public getServer() {
    return this.app;
  }

  private setConfig() {
    // Allows us to receive requests with data in json format
    this.app.use(bodyParser.json({ limit: '50mb' }));
    // Allows us to receive requests with data in x-www-form-urlencoded format
    this.app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
    // Enables cookieParser
    this.app.use(cookieParser());
    // Enables cors
    this.app.use(cors());
    // morgan middleware
    this.app.use(morganMiddleware);
  }

  private setMongoConfig() {
    mongoose.Promise = global.Promise;
    const MONGO_URI = process.env.MONGO_URI as string;
    mongoose
      .connect(MONGO_URI)
      .then(() => {
        logger.info('Database connected successfully');
      })
      .catch((error) => {
        logger.error(error);
      });
    mongoose.set('toJSON', {
      virtuals: true,
      transform: (doc: any, converted: any) => {
        delete converted._id;
        delete converted.__v;
      }
    });
  }

  private setControllers(controllers: Controller[]) {
    controllers.forEach((controller) => {
      this.app.use('/', controller.router);
    });
    this.app.all('*', pathNotFound);
  }

  private setErrorHandlingMiddleware() {
    this.app.use(errorHandler);
  }
}

export default App;
