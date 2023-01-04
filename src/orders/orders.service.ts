import OrderModel from './order.model';
import CreateOrderDto from './dto/createOrder.dto';
import {
    UpdateOrderDto,
    UpdateProjectDto,
    UpdateRequirementsDto,
    UpdateContactsDto
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
            .populate('owner', 'email firstName lastName id')
            .populate('specializations', 'id name');
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
        return await newOrder
            .populate('owner', 'email firstName lastName id');
    }

    public async deleteOrder(id: string): Promise<Order | null> {
        return await this.orderModel.findByIdAndDelete(id)
            .populate('owner', 'email firstName lastName id')
            .populate('specializations', 'id name');
    }

    public async updateOrder(id: string, order: UpdateOrderDto): Promise<Order | null> {
        return await this.orderModel.findByIdAndUpdate(
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

    public async updateProject(id: string, project: UpdateProjectDto): Promise<Order | null> {
        return await this.orderModel.findByIdAndUpdate(
            id,
            {
                $set: {
                    'project': {
                        '_id': id,
                        ...project
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
        return await this.orderModel.findByIdAndUpdate(
            id,
            {
                $set: {
                    'requirements': {
                        '_id': id,
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
        return await this.orderModel.findByIdAndUpdate(
            id,
            {
                $set: {
                    'contact': {
                        '_id': id,
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

    public async getAllOrdersOfUser(userId: string): Promise<Order[] | null> {
        return await this.orderModel.find({ owner: userId })
            .populate('owner', 'email firstName lastName id')
            .populate('specializations', 'id name');
    }

    public async getOrderById(id: string): Promise<Order | null> {
        return await this.orderModel.findById(id)
            .populate('owner', 'email firstName lastName id')
            .populate('specializations', 'id name');
    }

    public async publish(id: string, condition = Conditions.PUBLIC): Promise<Order | null> {
        return await this.orderModel.findByIdAndUpdate(
            id,
            {
                $set: {
                    'condition': condition
                }
            },
            { returnDocument: 'after' }
        )
            .populate('owner', 'email firstName lastName id')
            .populate('specializations', 'id name');
    }

    public async publishCancel(id: string, condition = Conditions.PRIVATE): Promise<Order | null> {
        return await this.orderModel.findByIdAndUpdate(
            id,
            {
                $set: {
                    'condition': condition
                }
            },
            { returnDocument: 'after' }
        )
            .populate('owner', 'email firstName lastName id')
            .populate('specializations', 'id name');
    }
}