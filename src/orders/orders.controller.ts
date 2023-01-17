import { Router, Request, Response, NextFunction } from 'express';
import { OrdersService } from './orders.service';
import dtoValidationMiddleware from '../middlewares/dtoValidation.middleware';
import CreateOrderDto from './dto/createOrder.dto';
import UpdateOrderDto from './dto/updateOrder.dto';
import UpdateProjectDto from './dto/updateProject.dto';
import UpdateRequirementsDto from './dto/updateRequirements.dto';
import UpdateContactsDto from './dto/updateContacts.dto';
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
    this.router.route(this.path).get(this.findAllOrders);
    this.router.route(`/my${this.path}/list`).get(authMiddleware, this.getAllOrdersOfUser);
    this.router
      .route(`/my${this.path}/new`)
      .post(authMiddleware, dtoValidationMiddleware(CreateOrderDto), this.createOrder);
    this.router.route(`${this.path}/:id`).get(this.findOrderById);
    this.router
      .route(`/my${this.path}/:id/edit`)
      .put(authMiddleware, isOwnerOrder, dtoValidationMiddleware(UpdateOrderDto, true), this.updateOrder);
    this.router
      .route(`/my${this.path}/project/:id/edit`)
      .put(
        authMiddleware,
        isOwnerOrder,
        upload.single('attachedFile'),
        dtoValidationMiddleware(UpdateProjectDto, true),
        this.updateProject
      );
    this.router
      .route(`/my${this.path}/reuirements/:id/edit`)
      .put(authMiddleware, isOwnerOrder, dtoValidationMiddleware(UpdateRequirementsDto, true), this.updateRequirements);
    this.router
      .route(`/my${this.path}/contacts/:id/edit`)
      .put(authMiddleware, isOwnerOrder, dtoValidationMiddleware(UpdateContactsDto, true), this.updateContacts);
    this.router.route(`/my${this.path}/:id/delete`).delete(authMiddleware, isOwnerOrder, this.deleteOrder);
    this.router.route(`/my${this.path}/:id/publish`).put(authMiddleware, isOwnerOrder, this.publish);
    this.router.route(`/my${this.path}/:id/publish/cancel`).put(authMiddleware, isOwnerOrder, this.publishCancel);
  }

  private findOrderById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const order = await this.ordersService.findOrderById(id);
      if (order) {
        return res.status(200).json(order);
      }
      next(new OrderNotFoundException(id));
    } catch (error) {
      return res.status(error.status || 500).json(error.message);
    }
  };

  private findAllOrders = async (req: Request, res: Response) => {
    try {
      const { query } = req;
      const orders = await this.ordersService.findAllOrders(query);
      return res.status(200).json(orders);
    } catch (error) {
      return res.status(error.status || 500).json(error.message);
    }
  };

  private createOrder = async (req: Request, res: Response) => {
    try {
      const orderData: CreateOrderDto = req.body;
      const newOrder = await this.ordersService.createOrder(orderData, (req as RequestWithUser).user);
      return res.status(201).json(newOrder);
    } catch (error) {
      return res.status(error.status || 500).json(error.message);
    }
  };

  private updateOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orderData: UpdateOrderDto = req.body;
      const { id } = req.params;
      const updateOrder = await this.ordersService.updateOrder(id, orderData);
      if (updateOrder) {
        return res.status(200).json(updateOrder);
      }
      next(new OrderNotFoundException(id));
    } catch (error) {
      return res.status(error.status || 500).json(error.message);
    }
  };

  private deleteOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const deleteOrder = await this.ordersService.deleteOrder(id);
      if (deleteOrder) {
        return res.status(200).json(deleteOrder);
      }
      next(new OrderNotFoundException(id));
    } catch (error) {
      return res.status(error.status || 500).json(error.message);
    }
  };

  private updateProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const projectData: UpdateProjectDto = req.body;
      const { id } = req.params;
      const { file } = req;
      const updateOrder = await this.ordersService.updateProject(id, projectData, file?.path);
      if (updateOrder) {
        return res.status(200).json(updateOrder);
      }
      next(new OrderNotFoundException(id));
    } catch (error) {
      return res.status(error.status || 500).json(error.message);
    }
  };

  private updateRequirements = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const requirementsData: UpdateRequirementsDto = req.body;
      const { id } = req.params;
      const updateOrder = await this.ordersService.updateRequirements(id, requirementsData);
      if (updateOrder) {
        return res.status(200).json(updateOrder);
      }
      next(new OrderNotFoundException(id));
    } catch (error) {
      return res.status(error.status || 500).json(error.message);
    }
  };

  private updateContacts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const contactsData: UpdateContactsDto = req.body;
      const { id } = req.params;
      const updateOrder = await this.ordersService.updateContacts(id, contactsData);
      if (updateOrder) {
        return res.status(200).json(updateOrder);
      }
      next(new OrderNotFoundException(id));
    } catch (error) {
      return res.status(error.status || 500).json(error.message);
    }
  };

  private publish = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const publishOrder = await this.ordersService.publish(id);
      if (publishOrder) {
        return res.status(200).json(publishOrder);
      }
      next(new OrderNotFoundException(id));
    } catch (error) {
      return res.status(error.status || 500).json(error.message);
    }
  };

  private publishCancel = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const publishCancelOrder = await this.ordersService.publishCancel(id);
      if (publishCancelOrder) {
        return res.status(200).json(publishCancelOrder);
      }
      next(new OrderNotFoundException(id));
    } catch (error) {
      return res.status(error.status || 500).json(error.message);
    }
  };

  private getAllOrdersOfUser = async (req: Request, res: Response) => {
    try {
      const userId = (req as RequestWithUser).user.id;
      const orders = await this.ordersService.getAllOrdersOfUser(userId);
      return res.status(200).json(orders);
    } catch (error) {
      return res.status(error.status || 500).json(error.message);
    }
  };
}
