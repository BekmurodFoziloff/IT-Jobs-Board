import RegionModel from './region.model';
import { CreateRegionDto } from './dto/createRegion.dto';
import { UpdateRegionDto } from './dto/updateRegion.dto';
import { Region } from './region.interface';
import moment from 'moment';
import { User } from '../users/user.interface';

export class RegionsService {
  private regionModel = RegionModel;

  public async findRegionById(id: string): Promise<Region | null> {
    return await this.regionModel.findById(id).populate('owner', 'email firstName lastName id');
  }

  public async findAllRegions(): Promise<Region[]> {
    return await this.regionModel.find({}).populate('owner', 'email firstName lastName id');
  }

  public async createRegion(region: CreateRegionDto, owner: User): Promise<Region> {
    const newRegion = await this.regionModel.create({
      ...region,
      owner,
      createdAt: moment().locale('uz-latn').format('LLLL')
    });
    await newRegion.save();
    await newRegion.populate('owner', 'email firstName lastName id');
    return newRegion;
  }

  public async updateRegion(id: string, region: UpdateRegionDto): Promise<Region | null> {
    return await this.regionModel
      .findByIdAndUpdate(
        id,
        {
          ...region,
          updatedAt: moment().locale('uz-latn').format('LLLL')
        },
        { returnDocument: 'after' }
      )
      .populate('owner', 'email firstName lastName id');
  }

  public async deleteRegion(id: string): Promise<Region | null> {
    return await this.regionModel.findByIdAndDelete(id).populate('owner', 'email firstName lastName id');
  }

  public async findRegionByName(name: string): Promise<Region | null> {
    return await this.regionModel.findOne({ name });
  }
}
