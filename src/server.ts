import 'dotenv/config';
import App from './app';
import { JobsController } from './jobs/jobs.controller';
import { AuthenticationController } from './authentication/authentication.controller';
import { UsersController } from './users/users.controller';
import { SpecializationCategoriesController } from './specializationCategories/specializationCategories.controller';
import { EmploymentTypesController } from './employmentTypes/employmentType.controller';
import { LegalFormsController } from './legalForms/legalForms.controller';
import { SkillsController } from './skills/skills.controller';
import { WorkStylesController } from './workStyles/workStyles.controller';
import { WorkExperiencesController } from './workExperiences/workExperiences.controller';
import { RegionsController } from './regions/regions.controller';
import { CompaniesController } from './companies/companies.controller';
import { SpecializationsController } from './specializations/specializations.controller';
import { IndustriesController } from './industries/industries.controller';
import { SpecializationsBPOController } from './specializationsBPO/specializationsBPO.controller';
import { JobApplicationsController } from './jobApplications/jobApplications.controller';
import { OrdersController } from './orders/orders.controller';

const app = new App([
  new JobsController(),
  new AuthenticationController(),
  new UsersController(),
  new SpecializationCategoriesController(),
  new EmploymentTypesController(),
  new LegalFormsController(),
  new SkillsController(),
  new WorkStylesController(),
  new WorkExperiencesController(),
  new RegionsController(),
  new CompaniesController(),
  new SpecializationsController(),
  new IndustriesController(),
  new SpecializationsBPOController(),
  new JobApplicationsController(),
  new OrdersController()
]);

app.listen();
