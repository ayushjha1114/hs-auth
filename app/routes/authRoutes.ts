import express from "express";
const jwt = require("jsonwebtoken");

import AuthController from "../controller/AuthController";

import expressJoiValidator from "express-joi-validator";
import expressJoi from "../lib/requestValidator";

import Template from "../helper/responseTemplate";
import { Router } from "express";
import ValidAuthTokenMiddleware from '../middleware/authMiddleware';
import logger from "../lib/logger";
import { ErrorMessage } from '../constant/errorMessage';

export class AuthRouter {
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
    this.router.post("/login", /* expressJoiValidator(expressJoi.loginUser), */ AuthController.validateUser);
  }
}

// Create the Router, and export its configured Express.Router
const authRoutes = new AuthRouter();
authRoutes.init();

export default authRoutes.router;
