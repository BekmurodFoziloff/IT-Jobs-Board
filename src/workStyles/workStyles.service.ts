import WorkStyleModel from './workStyle.model';
import { CreateWorkStyleDto } from './dto/createWorkStyle.dto';
import { UpdateWorkStyleDto } from './dto/updateWorkStyle.dto';
import { WorkStyle } from './workStyle.interface';
import moment from 'moment';
import { User } from '../users/user.interface';

export class WorkStylesService {
  private workStyleModel = WorkStyleModel;

  public async findWorkStyleById(id: string): Promise<WorkStyle | null> {
    return await this.workStyleModel.findById(id).populate('owner', 'email firstName lastName id');
  }

  public async findAllWorkStyles(page: number): Promise<WorkStyle[]> {
    let pageNumber = 1;
    const pageSize = Number(process.env.PAGE_SIZE);
    if (page) {
      pageNumber = page;
    }
    return await this.workStyleModel
      .find()
      .sort({ createdAt: -1 })
      .skip(pageNumber * pageSize - pageSize)
      .limit(pageSize)
      .populate('owner', 'email firstName lastName id');
  }

  public async createWorkStyle(workStyle: CreateWorkStyleDto, owner: User): Promise<WorkStyle> {
    const newWorkStyle = await this.workStyleModel.create({
      ...workStyle,
      owner,
      createdAt: moment().locale('uz-latn').format('LLLL')
    });
    await newWorkStyle.save();
    await newWorkStyle.populate('owner', 'email firstName lastName id');
    return newWorkStyle;
  }

  public async updateWorkStyle(id: string, workStyle: UpdateWorkStyleDto): Promise<WorkStyle | null> {
    return await this.workStyleModel
      .findByIdAndUpdate(
        id,
        {
          ...workStyle,
          updatedAt: moment().locale('uz-latn').format('LLLL')
        },
        { returnDocument: 'after' }
      )
      .populate('owner', 'email firstName lastName id');
  }

  public async deleteWorkStyle(id: string): Promise<WorkStyle | null> {
    return await this.workStyleModel.findByIdAndDelete(id).populate('owner', 'email firstName lastName id');
  }

  public async findWorkStyleByName(name: string): Promise<WorkStyle | null> {
    return await this.workStyleModel.findOne({ name });
  }
}
