import { Router } from "express";
// import expressJoiValidator from "express-joi-validator";
const validator = require('express-joi-validation').createValidator({})
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
        this.router.post("/login", validator.body(expressJoi.loginUser), AdminController.validateAdmin);
        this.router.post("/register-user", adminMiddleware.validateToken, validator.body(expressJoi.createUser), AdminController.registerUser);
        this.router.get("/user-list", adminMiddleware.validateToken,/*  expressJoiValidator(expressJoi.xxx), */ AdminController.getUserList);
        this.router.patch("/user", adminMiddleware.validateToken,/*  expressJoiValidator(expressJoi.xxx), */ AdminController.updateUserDetail);
    }
}

const authRoutes = new AdminRouter();
authRoutes.init();

export default authRoutes.router;