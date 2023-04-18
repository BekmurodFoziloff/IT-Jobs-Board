import LegalFormModel from './legalForm.model';
import { CreateLegalFormDto } from './dto/createLegalForm.dto';
import { UpdateLegalFormDto } from './dto/updateLegalForm.dto';
import { LegalForm } from './legalForm.interface';
import moment from 'moment';
import { User } from '../users/user.interface';

export class LegalFormsService {
  private legalFormModel = LegalFormModel;

  public async findLegalFormById(id: string): Promise<LegalForm | null> {
    return await this.legalFormModel.findById(id).populate('owner', 'email firstName lastName id');
  }

  public async findAllLegalForms(): Promise<LegalForm[]> {
    return await this.legalFormModel.find({}).populate('owner', 'email firstName lastName id');
  }

  public async createLegalForm(legalForm: CreateLegalFormDto, owner: User): Promise<LegalForm> {
    const newLegalForm = await this.legalFormModel.create({
      ...legalForm,
      owner,
      createdAt: moment().locale('uz-latn').format('LLLL')
    });
    await newLegalForm.save();
    await newLegalForm.populate('owner', 'email firstName lastName id');
    return newLegalForm;
  }

  public async updateLegalForm(id: string, legalForm: UpdateLegalFormDto): Promise<LegalForm | null> {
    return await this.legalFormModel
      .findByIdAndUpdate(
        id,
        {
          ...legalForm,
          updatedAt: moment().locale('uz-latn').format('LLLL')
        },
        { returnDocument: 'after' }
      )
      .populate('owner', 'email firstName lastName id');
  }

  public async deleteLegalForm(id: string): Promise<LegalForm | null> {
    return await this.legalFormModel.findByIdAndDelete(id).populate('owner', 'email firstName lastName id');
  }

  public async findLegalFormByName(name: string): Promise<LegalForm | null> {
    return await this.legalFormModel.findOne({ name });
  }
}
