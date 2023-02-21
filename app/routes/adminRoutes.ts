import { Router } from "express";
// import expressJoiValidator from "express-joi-validator";
const validator = require('express-joi-validation').createValidator({})
import expressJoi from "../lib/requestValidator";
import AdminController from "../controller/AdminController";
import adminMiddleware from '../middleware/adminMiddleware';

export class AdminRouter {
    router: Router;

    /**
     * Initialize the Router
     */
    constructor() {
        this.router = Router();
        this.init();
    }
    /**
     * Take each handler, and attach to one of the Express.Router's
     * endpoints.
     */
    init() {
        this.router.post("/login", validator.body(expressJoi.loginUser), AdminController.validateAdmin);
        this.router.post("/register-user", adminMiddleware.validateToken, /* validator.body(expressJoi.createUser), */ AdminController.registerUser);
        this.router.get("/user-list", adminMiddleware.validateToken,/*  expressJoiValidator(expressJoi.xxx), */ AdminController.getUserList);
        this.router.patch("/user", adminMiddleware.validateToken,/*  expressJoiValidator(expressJoi.xxx), */ AdminController.updateUserDetail);
        this.router.get("/user/:id", adminMiddleware.validateToken,/*  expressJoiValidator(expressJoi.xxx), */ AdminController.getUserById);
        this.router.post("/brand", adminMiddleware.validateToken,/*  expressJoiValidator(expressJoi.xxx), */ AdminController.createBrand);
        this.router.get("/brand-list", adminMiddleware.validateToken,/*  expressJoiValidator(expressJoi.xxx), */ AdminController.getBrandList);
        this.router.patch("/brand/:id", adminMiddleware.validateToken,/*  expressJoiValidator(expressJoi.xxx), */ AdminController.updateBrand);
        this.router.post("/service", adminMiddleware.validateToken,/*  expressJoiValidator(expressJoi.xxx), */ AdminController.createService);
        this.router.get("/service-list", adminMiddleware.validateToken,/*  expressJoiValidator(expressJoi.xxx), */ AdminController.getServiceList);
        this.router.patch("/service/:id", adminMiddleware.validateToken,/*  expressJoiValidator(expressJoi.xxx), */ AdminController.updateService);
        this.router.get("/service/:id", adminMiddleware.validateToken,/*  expressJoiValidator(expressJoi.xxx), */ AdminController.getServiceById);
        this.router.post("/ticket", adminMiddleware.validateToken,/*  expressJoiValidator(expressJoi.xxx), */ AdminController.createTicket);
        this.router.patch("/ticket/:id", adminMiddleware.validateToken,/*  expressJoiValidator(expressJoi.xxx), */ AdminController.updateTicket);
        this.router.get("/ticket/:id", adminMiddleware.validateToken,/*  expressJoiValidator(expressJoi.xxx), */ AdminController.getTicketById);
        this.router.get("/ticket-list", adminMiddleware.validateToken,/*  expressJoiValidator(expressJoi.xxx), */ AdminController.getTicketList);
        this.router.post("/payment-detail", adminMiddleware.validateToken,/*  expressJoiValidator(expressJoi.xxx), */ AdminController.savePaymentDetail);
        this.router.get("/payment-detail-list", adminMiddleware.validateToken,/*  expressJoiValidator(expressJoi.xxx), */ AdminController.getAllPaymentDetail);
        this.router.patch("/payment-detail/:id", adminMiddleware.validateToken,/*  expressJoiValidator(expressJoi.xxx), */ AdminController.updatePaymentDetail);
    }
}

const authRoutes = new AdminRouter();
authRoutes.init();

export default authRoutes.router;