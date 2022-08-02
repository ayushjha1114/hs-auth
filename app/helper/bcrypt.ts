
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');
import url from '../config/environments/dev';
const path = require('path');
const fs = require('fs');
const helper = {
  generateSaltValue(password) {
    const salt = bcrypt.genSaltSync(); // enter number of rounds, default: 10
    const hash = bcrypt.hashSync(password, salt);
    return hash;
  },
  comparePassword(userPassword, password ) {
    if (!userPassword.length ||  !( password && password.length > 0) ) {
      return false;
    }
    return bcrypt.compareSync(userPassword, password);
  },
  authRedirectUrl( path ) {
		return `${url.FE}/validate-token/${path}`;
	},
	
  buildUserToken(data) {
    return {
        login_id: data.id,
		type: data.type,
		name: data.name,
		hasPassword: data.password ? true : false
    }
  },
  resource( path ) {
		return `${url.API}${path}`;
	},
  getFileExtension( file ) {
		let extensions = file.split('.');
		if ( extensions.length === 1 ) {
			return 'jpg';
		} else {
			return extensions.pop();
		}
	},
	randomString() {
		return Math.random().toString(36).substring(2, 7);
  },
};

export default helper;


