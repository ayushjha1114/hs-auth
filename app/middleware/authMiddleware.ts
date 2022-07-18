require('dotenv').config();
const jwt = require("jsonwebtoken");
import responseTemplate from '../helper/responseTemplate';
import AuthController from "../controller/AuthController";
import helper from '../helper/bcrypt';
const validation: any = {
  validateToken(req, res, next) {
    try {
      // validate token here is its valid here
      const token = req.headers.authorization;

      if (token) {
        jwt.verify(token, process.env.SECRET_KEY, (err, data) => {
          if (err) {
            res.status(403).json(responseTemplate.commonAuthUserDataError());
          } else {
            AuthController.getUserByDistributorId(data.login_id, (error, user) => {
              if (error) {
                res.status(403).json(responseTemplate.commonAuthUserDataError());
              }
              user.hasPassword = user.password ? true : false;
              req.user = user;
              next();
            })
          }
        });
      } else {
        res.status(403).json(responseTemplate.tokenRequiredAuthError());
      }
    } catch (error) {
      res.status(500).json(responseTemplate.error('Technical Error', 'There may some error occurred in user validation'));
    }

  },



};

export default validation;
