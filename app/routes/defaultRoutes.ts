import express from "express";
const router = express.Router();
import { Router } from "express";

export class DefaultRouter {
  router: Router;

  /**
   * Initialize the Router
   */
  constructor() {
    this.router = Router();
  }

  public rootPage(req: express.Request, res: express.Response) {
    res.status(200).json({ success: true, message: 'App is up and running with PostgresSql + node .. ⚡️⚡️⚡️⚡️⚡️⚡️⚡️' });
  };

  init() {
    this.router.get("/", this.rootPage);
  }
}


// Create the Router, and export its configured Express.Router
const defaultRouter = new DefaultRouter();
defaultRouter.init();

export default defaultRouter.router;
