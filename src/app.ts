import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import { JobsController } from './jobs/jobs.controller';
import { JobsService } from './jobs/jobs.service';
import { AuthenticationController } from './authentication/authentication.controller';
import { AuthenticationService } from './authentication/authentication.service';
import { UsersService } from './users/users.service';
import { UsersController } from './users/users.controller';
import { SpecializationCategoriesController } from './specializationCategories/specializationCategories.controller';
import { SpecializationCategoriesService } from './specializationCategories/specializationCategories.service';
import { EmploymentTypesController } from './employmentTypes/employmentType.controller';
import { EmploymentTypesService } from './employmentTypes/employmentTypes.service';
import { LegalFormsController } from './legalForms/legalForms.controller';
import { LegalFormsService } from './legalForms/legalForms.service';
import { SkillsController } from './skills/skills.controller';
import { SkillsService } from './skills/skills.service';
import { WorkStylesController } from './workStyles/workStyles.controller';
import { WorkStylesService } from './workStyles/workStyles.service';
import { WorkExperiencesController } from './workExperiences/workExperiences.controller';
import { WorkExperiencesService } from './workExperiences/workExperiences.service';
import { RegionsController } from './regions/regions.controller';
import { RegionsService } from './regions/regions.service';
import { CompaniesController } from './companies/companies.controller';
import { CompaniesService } from './companies/companies.service';
import { SpecializationsController } from './specializations/specializations.controller';
import { SpecializationsService } from './specializations/specializations.service';
import { IndustriesController } from './industries/industries.controller';
import { IndustriesService } from './industries/industries.service';
import { SpecializationsBPOController } from './specializationsBPO/specializationsBPO.controller';
import { SpecializationsBPOService } from './specializationsBPO/specializationsBPO.service';
import { JobApplicationsController } from './jobApplications/jobApplications.controller';
import { JobApplicationsService } from './jobApplications/jobApplications.service';
import { OrdersController } from './orders/orders.controller';
import { OrdersService } from './orders/orders.service';
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
        // Enables cookieParser
        this.app.use(cookieParser());
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

        const authenticationController = new AuthenticationController(new AuthenticationService(), new UsersService());
        this.app.use('/api/v1', authenticationController.router);

        const usersController = new UsersController(new UsersService());
        this.app.use('/api/v1', usersController.router);

        const specializationCategoriesController = new SpecializationCategoriesController(new SpecializationCategoriesService());
        this.app.use('/api/v1', specializationCategoriesController.router);

        const employmentTypesController = new EmploymentTypesController(new EmploymentTypesService());
        this.app.use('/api/v1', employmentTypesController.router);

        const legalFormsController = new LegalFormsController(new LegalFormsService());
        this.app.use('/api/v1', legalFormsController.router);

        const skillsController = new SkillsController(new SkillsService());
        this.app.use('/api/v1', skillsController.router);

        const workExperiencesController = new WorkExperiencesController(new WorkExperiencesService());
        this.app.use('/api/v1', workExperiencesController.router);

        const workStylesController = new WorkStylesController(new WorkStylesService());
        this.app.use('/api/v1', workStylesController.router);

        const regionsController = new RegionsController(new RegionsService());
        this.app.use('/api/v1', regionsController.router);

        const companiesController = new CompaniesController(new CompaniesService());
        this.app.use('/api/v1', companiesController.router);

        const specializationsController = new SpecializationsController(new SpecializationsService());
        this.app.use('/api/v1', specializationsController.router);

        const industriesController = new IndustriesController(new IndustriesService());
        this.app.use('/api/v1', industriesController.router);

        const specializationsBPOController = new SpecializationsBPOController(new SpecializationsBPOService());
        this.app.use('/api/v1', specializationsBPOController.router);

        const jobApplicationsController = new JobApplicationsController(new JobApplicationsService(), new JobsService());
        this.app.use('/api/v1', jobApplicationsController.router);

        const ordersController = new OrdersController(new OrdersService());
        this.app.use('/api/v1', ordersController.router);
    }

    private setErrorHandlingMiddleware() {
        this.app.use(errorHandler);
    }
}

export default new App().app;