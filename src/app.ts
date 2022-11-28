import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import { JobsController } from './jobs/jobs.controller';
import { JobsService } from './jobs/jobs.service';
import errorHandler from './middlewares/errorHandler.middleware';

class App {
    public app: express.Application;

    constructor() {
        this.app = express();
        this.setConfig();
        this.setControllers();
        this.setMongoConfig();
        this.setErrorHandlingMiddleware();
    }

    private setConfig() {
        // Allows us to receive requests with data in json format
        this.app.use(bodyParser.json({ limit: '50mb' }));
        // Allows us to receive requests with data in x-www-form-urlencoded format
        this.app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
        // Enables cors
        this.app.use(cors());
    }

    private setMongoConfig() {
        mongoose.Promise = global.Promise;
        const MONGO_URI = process.env.MONGO_URI as string;
        mongoose.connect(MONGO_URI)
        .then(() => {
            console.log('Database connected successfully');
        })
        .catch((error) => {
            console.log(error);
        });
        mongoose.set('toJSON', {
            virtuals: true,
            transform: (doc: any, converted: any) => {
                delete converted._id;
                delete converted.__v;
            }
        });
    }

    private setControllers() {
        const jobsController = new JobsController(new JobsService());
        this.app.use('/api/v1', jobsController.router);
    }

    private setErrorHandlingMiddleware() {
        this.app.use(errorHandler);
    }
}

export default new App().app;