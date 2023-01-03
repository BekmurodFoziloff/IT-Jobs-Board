import { Router, Request, Response, NextFunction } from 'express';
import { OrdersService } from './orders.service';
import dtoValidationMiddleware from '../middlewares/dtoValidation.middleware';
import CreateOrderDto from './dto/createOrder.dto';
import {
    UpdateOrderDto,
    UpdateGeneralInformationAboutTheProjectDto,
    UpdateGeneralRequirementsToTheExecutorDto,
    UpdateContactInformationDto
} from './dto/updateOrder.dto';
import OrderNotFoundException from '../exceptions/OrderNotFoundException';
import authMiddleware from '../middlewares/auth.middleware';
import RequestWithUser from '../interfaces/requestWithUser.interface';

export class OrdersController {
    public path = '/order';
    public router = Router();

    constructor(private ordersService: OrdersService) {
        this.setRoutes();
    }

    public setRoutes() {
        this.router.route(this.path)
            .get(this.findAllOrders);
        this.router.route(`/my${this.path}/list`)
            .get(authMiddleware, this.getAllOrdersOfUser);
        this.router.route(`/my${this.path}/new`)
            .post(authMiddleware, dtoValidationMiddleware(CreateOrderDto), this.createOrder);
        this.router.route(`${this.path}/:id`)
            .get(this.findOrderById);
        this.router.route(`/my${this.path}/:id/edit`)
            .put(authMiddleware, dtoValidationMiddleware(UpdateOrderDto, true), this.updateOrder);
        this.router.route(`/my${this.path}/project/:id/edit`)
            .put(authMiddleware, dtoValidationMiddleware(UpdateGeneralInformationAboutTheProjectDto, true), this.updateOrderProject);
        this.router.route(`/my${this.path}/reuirement/:id/edit`)
            .put(authMiddleware, dtoValidationMiddleware(UpdateGeneralRequirementsToTheExecutorDto, true), this.updateOrderRequirement);
        this.router.route(`/my${this.path}/contact/:id/edit`)
            .put(authMiddleware, dtoValidationMiddleware(UpdateContactInformationDto, true), this.updateOrderContact);
        this.router.route(`/my${this.path}/:id/delete`)
            .delete(authMiddleware, this.deleteOrder);
        this.router.route(`/my${this.path}/:id/publish`)
            .put(authMiddleware, this.publish);
        this.router.route(`/my${this.path}/:id/publish-cancel`)
            .put(authMiddleware, this.publishCancel);
    }

    private findOrderById = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const order = await this.ordersService.findOrderById(id);
        if (order) {
            return res.send(order);
        }
        next(new OrderNotFoundException(id));
    }

    private findAllOrders = async (req: Request, res: Response) => {
        const { query } = req;
        console.log(query);
        const orders = await this.ordersService.findAllOrders(query);
        res.send(orders);
    }

    private createOrder = async (req: Request, res: Response) => {
        const orderData: CreateOrderDto = req.body;
        const newOrderResult = await this.ordersService.createOrder(
            orderData,
            (req as RequestWithUser).user
        );
        res.send(newOrderResult);
    }

    private deleteOrder = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const deleteOrderResult = await this.ordersService.deleteOrder(id);
        if (deleteOrderResult) {
            return res.send(deleteOrderResult);
        }
        next(new OrderNotFoundException(id));
    }

    private updateOrder = async (req: Request, res: Response, next: NextFunction) => {
        const orderData: UpdateOrderDto = req.body;
        const { id } = req.params;
        await this.ordersService.updateOrder(
            id,
            orderData
        );
        const updateOrderResult = await this.ordersService.findOrderByIdForUpdate(id);
        if (updateOrderResult) {
            return res.send(updateOrderResult);
        }
        next(new OrderNotFoundException(id));
    }

    private updateOrderProject = async (req: Request, res: Response, next: NextFunction) => {
        const orderData: UpdateGeneralInformationAboutTheProjectDto = req.body;
        const { id } = req.params;
        await this.ordersService.updateOrderProject(
            id,
            orderData
        );
        const updateOrderResult = await this.ordersService.findOrderByIdForUpdate(id);
        if (updateOrderResult) {
            return res.send(updateOrderResult);
        }
        next(new OrderNotFoundException(id));
    }

    private updateOrderRequirement = async (req: Request, res: Response, next: NextFunction) => {
        const orderData: UpdateGeneralRequirementsToTheExecutorDto = req.body;
        const { id } = req.params;
        await this.ordersService.updateOrderRequirement(
            id,
            orderData
        );
        const updateOrderResult = await this.ordersService.findOrderByIdForUpdate(id);
        if (updateOrderResult) {
            return res.send(updateOrderResult);
        }
        next(new OrderNotFoundException(id));
    }

    private updateOrderContact = async (req: Request, res: Response, next: NextFunction) => {
        const orderData: UpdateContactInformationDto = req.body;
        const { id } = req.params;
        await this.ordersService.updateOrderContact(
            id,
            orderData
        );
        const updateOrderResult = await this.ordersService.findOrderByIdForUpdate(id);
        if (updateOrderResult) {
            return res.send(updateOrderResult);
        }
        next(new OrderNotFoundException(id));
    }

    private publish = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        await this.ordersService.publish(id);
        const publishOrderResult = await this.ordersService.findOrderByIdForUpdate(id);
        if (publishOrderResult) {
            return res.send(publishOrderResult);
        }
        next(new OrderNotFoundException(id));
    }

    private publishCancel = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        await this.ordersService.publishCancel(id);
        const publishCancelOrderResult = await this.ordersService.findOrderByIdForUpdate(id);
        if (publishCancelOrderResult) {
            return res.send(publishCancelOrderResult);
        }
        next(new OrderNotFoundException(id));
    }

    private getAllOrdersOfUser = async (req: Request, res: Response) => {
        const userId = (req as RequestWithUser).user.id;
        const orders = await this.ordersService.getAllOrdersOfUser(userId);
        return res.send(orders);
    }
}