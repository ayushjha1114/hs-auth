import { Router } from "express";
import expressJoiValidator from "express-joi-validator";
import expressJoi from "../lib/requestValidator";
import AdminController from "../controller/AdminController";
import adminMiddleware from '../middleware/adminMiddleware';
import AuthController from "../controller/AuthController";

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
        this.router.post("/login", /* expressJoiValidator(expressJoi.loginUser), */ AdminController.validateAdmin);
        this.router.post("/register_user", /* expressJoiValidator(expressJoi.loginUser), */ AdminController.registerUser);
        this.router.get("/user-list",/*  adminMiddleware.validateToken, expressJoiValidator(expressJoi.distributorList), */ AdminController.getUserList);
        this.router.patch("/user",/*  adminMiddleware.validateToken, expressJoiValidator(expressJoi.distributorList), */ AdminController.updateUserDetail);
    }
}

const authRoutes = new AdminRouter();
authRoutes.init();

export default authRoutes.router;