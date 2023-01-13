import { Router, Request, Response, NextFunction } from 'express';
import { OrdersService } from './orders.service';
import dtoValidationMiddleware from '../middlewares/dtoValidation.middleware';
import CreateOrderDto from './dto/createOrder.dto';
import {
    UpdateOrderDto,
    UpdateProjectDto,
    UpdateRequirementsDto,
    UpdateContactsDto
}
    from './dto/updateOrder.dto';
import OrderNotFoundException from '../exceptions/OrderNotFoundException';
import authMiddleware from '../middlewares/auth.middleware';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import isOwnerOrder from '../middlewares/isOwnenOrder.middleware';
import { upload } from '../files/files.service';

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
            .put(authMiddleware, isOwnerOrder, dtoValidationMiddleware(UpdateOrderDto, true), this.updateOrder);
        this.router.route(`/my${this.path}/project/:id/edit`)
            .put(authMiddleware, isOwnerOrder, upload.single('attachedFile'), dtoValidationMiddleware(UpdateProjectDto, true), this.updateProject);
        this.router.route(`/my${this.path}/reuirements/:id/edit`)
            .put(authMiddleware, isOwnerOrder, dtoValidationMiddleware(UpdateRequirementsDto, true), this.updateRequirements);
        this.router.route(`/my${this.path}/contacts/:id/edit`)
            .put(authMiddleware, isOwnerOrder, dtoValidationMiddleware(UpdateContactsDto, true), this.updateContacts);
        this.router.route(`/my${this.path}/:id/delete`)
            .delete(authMiddleware, isOwnerOrder, this.deleteOrder);
        this.router.route(`/my${this.path}/:id/publish`)
            .put(authMiddleware, isOwnerOrder, this.publish);
        this.router.route(`/my${this.path}/:id/publish-cancel`)
            .put(authMiddleware, isOwnerOrder, this.publishCancel);
    }

    private findOrderById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const order = await this.ordersService.findOrderById(id);
            if (order) {
                return res.send(order);
            }
            next(new OrderNotFoundException(id));
        } catch (error) {
            next(error);
        }
    }

    private findAllOrders = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { query } = req;
            const orders = await this.ordersService.findAllOrders(query);
            res.send(orders);
        } catch (error) {
            next(error);
        }
    }

    private createOrder = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const orderData: CreateOrderDto = req.body;
            const newOrderResult = await this.ordersService.createOrder(
                orderData,
                (req as RequestWithUser).user
            );
            res.send(newOrderResult);
        } catch (error) {
            next(error);
        }
    }

    private deleteOrder = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const deleteOrderResult = await this.ordersService.deleteOrder(id);
            if (deleteOrderResult) {
                return res.send(deleteOrderResult);
            }
            next(new OrderNotFoundException(id));
        } catch (error) {
            next(error);
        }
    }

    private updateOrder = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const orderData: UpdateOrderDto = req.body;
            const { id } = req.params;
            const updateOrderResult = await this.ordersService.updateOrder(
                id,
                orderData
            );
            if (updateOrderResult) {
                return res.send(updateOrderResult);
            }
            next(new OrderNotFoundException(id));
        } catch (error) {
            next(error);
        }
    }

    private updateProject = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const orderData: UpdateProjectDto = req.body;
            const { id } = req.params;
            const { file } = req;
            const updateOrderResult = await this.ordersService.updateProject(
                id,
                orderData,
                file?.path
            );
            if (updateOrderResult) {
                return res.send(updateOrderResult);
            }
            next(new OrderNotFoundException(id));
        } catch (error) {
            next(error);
        }
    }

    private updateRequirements = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const orderData: UpdateRequirementsDto = req.body;
            const { id } = req.params;
            const updateOrderResult = await this.ordersService.updateRequirements(
                id,
                orderData
            );
            if (updateOrderResult) {
                return res.send(updateOrderResult);
            }
            next(new OrderNotFoundException(id));
        } catch (error) {
            next(error);
        }
    }

    private updateContacts = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const orderData: UpdateContactsDto = req.body;
            const { id } = req.params;
            const updateOrderResult = await this.ordersService.updateContacts(
                id,
                orderData
            );
            if (updateOrderResult) {
                return res.send(updateOrderResult);
            }
            next(new OrderNotFoundException(id));
        } catch (error) {
            next(error);
        }
    }

    private publish = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const publishOrderResult = await this.ordersService.publish(id);
            if (publishOrderResult) {
                return res.send(publishOrderResult);
            }
            next(new OrderNotFoundException(id));
        } catch (error) {
            next(error);
        }
    }

    private publishCancel = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const publishCancelOrderResult = await this.ordersService.publishCancel(id);
            if (publishCancelOrderResult) {
                return res.send(publishCancelOrderResult);
            }
            next(new OrderNotFoundException(id));
        } catch (error) {
            next(error);
        }
    }

    private getAllOrdersOfUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (req as RequestWithUser).user.id;
            const orders = await this.ordersService.getAllOrdersOfUser(userId);
            return res.send(orders);
        } catch (error) {
            next(error);
        }
    }
}