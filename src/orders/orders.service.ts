import OrderModel from './order.model';
import CreateOrderDto from './dto/createOrder.dto';
import {
    UpdateOrderDto,
    UpdateGeneralInformationAboutTheProjectDto,
    UpdateGeneralRequirementsToTheExecutorDto,
    UpdateContactInformationDto
}
    from './dto/updateOrder.dto';
import { Order } from './order.interface';
import moment from 'moment';
import { User } from '../users/user.interface';
import { Conditions } from '../utils/enums/condition.enum';
import OrderFilterQuery from '../interfaces/orderFilterQuery.interface';

export class OrdersService {
    private orderModel = OrderModel;

    public async findOrderById(id: string): Promise<Order | null> {
        return await this.orderModel.findById(id)
            .where('condition').equals(Conditions.PUBLIC)
            .populate('owner', '-password')
            .populate('specializations', '-owner');
    }

    public async findAllOrders(queryObj: any): Promise<Order[] | null> {
        const query: OrderFilterQuery = {};
        if (queryObj.specializations && queryObj.specializations.length > 0) {
            query['specializations'] = { $in: queryObj.specializations }
        } else if (queryObj.minBudget) {
            query['minBudget'] = { $gte: queryObj.minBudget }
        } else if (queryObj.maxBudget) {
            query['maxBudget'] = { $lte: queryObj.maxBudget }
        } else if (queryObj.customerType) {
            query['customerType'] = { $in: queryObj.customerType }
        } else if (queryObj.status) {
            query['status'] = { $in: queryObj.status }
        } else if (queryObj.archived) {
            query['archived'] = { $in: queryObj.archived }
        }
        return await this.orderModel.find(query)
            .where('condition').equals(Conditions.PUBLIC)
            .populate('owner', '-password')
            .populate('specializations', '-owner');
    }

    public async createOrder(order: CreateOrderDto, owner: User): Promise<Order> {
        const newOrder = await this.orderModel.create({
            ...order,
            owner,
            createdAt: moment().locale('uz-latn').format('LLLL')
        });
        await newOrder.save();
        return await newOrder
            .populate('owner', '-password');
    }

    public async deleteOrder(id: string): Promise<Order | null> {
        return await this.orderModel.findByIdAndDelete(id)
            .populate('owner', '-password')
            .populate('specializations', '-owner');
    }

    public async updateOrder(id: string, order: UpdateOrderDto): Promise<Order | null> {
        return await this.orderModel.findByIdAndUpdate(
            id,
            {
                ...order,
                updatedAt: moment().locale('uz-latn').format('LLLL')
            }
        )
            .populate('owner', '-password')
            .populate('specializations', '-owner');
    }

    public async updateOrderProject(id: string, order: UpdateGeneralInformationAboutTheProjectDto): Promise<Order | null> {
        return await this.orderModel.findByIdAndUpdate(
            id,
            {
                $set: {
                    'project': {
                        '_id': id,
                        ...order
                    }
                },
                updatedAt: moment().locale('uz-latn').format('LLLL')
            }
        )
            .populate('owner', '-password')
            .populate('specializations', '-owner');
    }

    public async updateOrderRequirement(id: string, order: UpdateGeneralRequirementsToTheExecutorDto): Promise<Order | null> {
        return await this.orderModel.findByIdAndUpdate(
            id,
            {
                $set: {
                    'requirement': {
                        '_id': id,
                        ...order
                    }
                },
                updatedAt: moment().locale('uz-latn').format('LLLL')
            }
        )
            .populate('owner', '-password')
            .populate('specializations', '-owner');
    }

    public async updateOrderContact(id: string, order: UpdateContactInformationDto): Promise<Order | null> {
        return await this.orderModel.findByIdAndUpdate(
            id,
            {
                $set: {
                    'contact': {
                        '_id': id,
                        ...order
                    }
                },
                updatedAt: moment().locale('uz-latn').format('LLLL')
            }
        )
            .populate('owner', '-password')
            .populate('specializations', '-owner');
    }

    public async getAllOrdersOfUser(userId: string): Promise<Order[] | null> {
        return await this.orderModel.find({ owner: userId })
            .populate('owner', '-password')
            .populate('specializations', '-owner');
    }

    public async findOrderByIdForUpdate(id: string): Promise<Order | null> {
        return await this.orderModel.findById(id)
            .populate('owner', '-password')
            .populate('specializations', '-owner');
    }

    public async publish(id: string, condition = Conditions.PUBLIC): Promise<Order | null> {
        return await this.orderModel.findByIdAndUpdate(
            id,
            {
                $set: {
                    'condition': condition
                }
            }
        )
            .populate('owner', '-password')
            .populate('specializations', '-owner');
    }

    public async publishCancel(id: string, condition = Conditions.PRIVATE): Promise<Order | null> {
        return await this.orderModel.findByIdAndUpdate(
            id,
            {
                $set: {
                    'condition': condition
                }
            }
        )
            .populate('owner', '-password')
            .populate('specializations', '-owner');
    }
}