import express from "express";
const jwt = require("jsonwebtoken");

import AuthController from "../controller/AuthController";

import url from '../config/environments/dev';
import expressJoiValidator from "express-joi-validator";
import expressJoi from "../lib/requestValidator";

import Template from "../helper/responseTemplate";
const boom = require("express-boom");
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
 * @api {POST} /fetch/user/:code
 * @apiName fetchUser
 * @apiGroup Auth
 * @apiSuccess {String} code HTTP status code from API.
 * @apiSuccess {String} message Message from API.
 */
  public async fetchUser(req: express.Request, res: express.Response) {
    try {
      const { id } = req.params;
      const response = await AuthController.getUserById({ id, req, res });

      if (response.success) {
        res.status(200).json(Template.success(response.userData, "User data fetched successfully"));
      } else {
        if (response.message === ErrorMessage.UNAUTHORIZED) {
          res.status(401).json(Template.errorMessage(ErrorMessage.UNAUTHORIZED));
        } else {
          res.status(400).json(Template.error(
            "Technical Error",
            "User data not found"
          ));
        }
      }
    } catch (error) {
      logger.error(`Error in fetchUser: ${error}`);
      res.status(500).json(Template.error(
        'Technical issue',
        'There may be error occurred while fetching the user data'
      ));
    }

  }


  /**
   * Take each handler, and attach to one of the Express.Router's
   * endpoints.
   */
  init() {
    this.router.post("/login", expressJoiValidator(expressJoi.loginUser), AuthController.validateUser);
    this.router.get("/user/fetch/:id", /* ValidAuthTokenMiddleware.validateToken, */ this.fetchUser);
  }
}

// Create the HeroRouter, and export its configured Express.Router
const authRoutes = new AuthRouter();
authRoutes.init();

export default authRoutes.router;
