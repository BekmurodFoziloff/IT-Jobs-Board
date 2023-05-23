import OrderModel from './order.model';
import CreateOrderDto from './dto/createOrder.dto';
import UpdateOrderDto from './dto/updateOrder.dto';
import UpdateProjectDto from './dto/updateProject.dto';
import UpdateRequirementsDto from './dto/updateRequirements.dto';
import UpdateContactsDto from './dto/updateContacts.dto';
import { Order } from './order.interface';
import moment from 'moment';
import { User } from '../users/user.interface';
import { PublishConditions } from '../utils/enums/publishCondition.enum';
import OrderFilterQuery from '../interfaces/orderFilterQuery.interface';

export class OrdersService {
  private orderModel = OrderModel;

  public async findOrderById(id: string): Promise<Order | null> {
    return await this.orderModel
      .findById(id)
      .where('isPublished')
      .equals(PublishConditions.PUBLIC)
      .populate('owner', 'email firstName lastName id')
      .populate('specializations', 'id name');
  }

  public async findAllOrders(queryObj: any): Promise<Order[] | null> {
    const query: OrderFilterQuery = {};
    let pageNumber = 1;
    const pageSize = Number(process.env.PAGE_SIZE);
    if (queryObj.page) {
      pageNumber = Number(queryObj.page);
    } else if (queryObj.search) {
      query['$or'] = [{ title: { $regex: queryObj.search, $options: 'i' } }];
    } else if (queryObj.specializations && queryObj.specializations.length > 0) {
      query['specializations'] = { $in: queryObj.specializations };
    } else if (queryObj.minBudget) {
      query['minBudget'] = { $gte: queryObj.minBudget };
    } else if (queryObj.maxBudget) {
      query['maxBudget'] = { $lte: queryObj.maxBudget };
    } else if (queryObj.customerType) {
      query['customerType'] = { $in: queryObj.customerType };
    } else if (queryObj.status) {
      query['status'] = { $in: queryObj.status };
    } else if (queryObj.archived) {
      query['archived'] = { $in: queryObj.archived };
    }
    return await this.orderModel
      .find(query)
      .sort({ createdAt: -1 })
      .skip(pageNumber * pageSize - pageSize)
      .limit(pageSize)
      .where('isPublished')
      .equals(PublishConditions.PUBLIC)
      .populate('owner', 'email firstName lastName id')
      .populate('specializations', 'id name');
  }

  public async createOrder(order: CreateOrderDto, owner: User): Promise<Order> {
    const newOrder = await this.orderModel.create({
      ...order,
      owner,
      createdAt: moment().locale('uz-latn').format('LLLL')
    });
    await newOrder.save();
    return await newOrder.populate('owner', 'email firstName lastName id');
  }

  public async updateOrder(id: string, order: UpdateOrderDto): Promise<Order | null> {
    return await this.orderModel
      .findByIdAndUpdate(
        id,
        {
          ...order,
          updatedAt: moment().locale('uz-latn').format('LLLL')
        },
        { returnDocument: 'after' }
      )
      .populate('owner', 'email firstName lastName id')
      .populate('specializations', 'id name');
  }

  public async deleteOrder(id: string): Promise<Order | null> {
    return await this.orderModel
      .findByIdAndDelete(id)
      .populate('owner', 'email firstName lastName id')
      .populate('specializations', 'id name');
  }

  public async updateProject(id: string, project: UpdateProjectDto, attachedFile: any): Promise<Order | null> {
    return await this.orderModel
      .findByIdAndUpdate(
        id,
        {
          $set: {
            project: {
              _id: id,
              ...project,
              attachedFile
            }
          },
          updatedAt: moment().locale('uz-latn').format('LLLL')
        },
        { returnDocument: 'after' }
      )
      .populate('owner', 'email firstName lastName id')
      .populate('specializations', 'id name');
  }

  public async updateRequirements(id: string, requirements: UpdateRequirementsDto): Promise<Order | null> {
    return await this.orderModel
      .findByIdAndUpdate(
        id,
        {
          $set: {
            requirements: {
              _id: id,
              ...requirements
            }
          },
          updatedAt: moment().locale('uz-latn').format('LLLL')
        },
        { returnDocument: 'after' }
      )
      .populate('owner', 'email firstName lastName id')
      .populate('specializations', 'id name');
  }

  public async updateContacts(id: string, contacts: UpdateContactsDto): Promise<Order | null> {
    return await this.orderModel
      .findByIdAndUpdate(
        id,
        {
          $set: {
            contact: {
              _id: id,
              ...contacts
            }
          },
          updatedAt: moment().locale('uz-latn').format('LLLL')
        },
        { returnDocument: 'after' }
      )
      .populate('owner', 'email firstName lastName id')
      .populate('specializations', 'id name');
  }

  public async getAllOrdersOfUser(userId: string, queryObj: any): Promise<Order[] | null> {
    const query: OrderFilterQuery = {};
    let pageNumber = 1;
    const pageSize = Number(process.env.PAGE_SIZE);
    if (userId) {
      query['owner'] = userId;
    } else if (queryObj.page) {
      pageNumber = Number(queryObj.page);
    } else if (queryObj.search) {
      query['$or'] = [{ title: { $regex: queryObj.search, $options: 'i' } }];
    }
    return await this.orderModel
      .find(query)
      .sort({ createdAt: -1 })
      .skip(pageNumber * pageSize - pageSize)
      .limit(pageSize)
      .populate('owner', 'email firstName lastName id')
      .populate('specializations', 'id name');
  }

  public async getOrderById(id: string): Promise<Order | null> {
    return await this.orderModel
      .findById(id)
      .populate('owner', 'email firstName lastName id')
      .populate('specializations', 'id name');
  }

  public async publish(id: string, publishCondition = PublishConditions.PUBLIC): Promise<Order | null> {
    return await this.orderModel
      .findByIdAndUpdate(
        id,
        {
          $set: {
            isPublished: publishCondition
          }
        },
        { returnDocument: 'after' }
      )
      .populate('owner', 'email firstName lastName id')
      .populate('specializations', 'id name');
  }

  public async publishCancel(id: string, publishCondition = PublishConditions.PRIVATE): Promise<Order | null> {
    return await this.orderModel
      .findByIdAndUpdate(
        id,
        {
          $set: {
            isPublished: publishCondition
          }
        },
        { returnDocument: 'after' }
      )
      .populate('owner', 'email firstName lastName id')
      .populate('specializations', 'id name');
  }
}
