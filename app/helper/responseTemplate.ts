/* istanbul ignore file */
const data: any = {
  general(data) {
    return data;
  },
  successMessage(message) {
    return {
      success: true,
      message
    };
  },
  success(data, message) {
    return {
      success: true,
      message,
      data
    };
  },
  error(message, err, code = null) {
    return {
      success: false,
      message: message || 'Some error occurred while processing your request.',
      error: err || 'Error occurred on server, please try again after some time.'
    };
  },
  errorMessage(message) {
    return {
      success: false,
      message
    };
  },
  emptyContent() {
    return this.general({
      message: 'empty content found',
      description: 'you must provide valid data and it must not be empty.',
      helpful_links: ['http://stackoverflow.com/questions/18419428/what-is-the-minimum-valid-json']
    });
  },
  invalidContentType() {
    return this.general({
      message: 'invalid content type',
      description: 'you must specify content type and it must be application/json',
      helpful_links: ['http://stackoverflow.com/questions/477816/what-is-the-correct-json-content-type']
    });
  },
  BadRequestFromJoi(err) {
    return this.error(
      err.message,
      err.error
    );
  },
  userAlreadyExist(err) {
    return this.general({
      success: false,
      message: 'user already registered in System',
      description: 'user already registered in System'
    });
  },
  mobiledoesNotExist() {
    return this.general({
      success: false,
      message: 'Mobile number in our record is not correct, please connect with your TSE',
      description: 'Mobile Number not registered for the provided Distributor ID'
    });
  },
  userdoesNotExist(err) {
    return this.general({
      success: false,
      message: err.message || 'Please enter correct username/password',
      description: 'user account does not exist in system'
    });
  },
  commonAuthUserDataError() {
    return this.error(
      'Authentication error',
      'token verification failed, Please try again'
    );
  },
  tokenRequiredAuthError() {
    return this.error(
      'Authentication error, Token is required in Header',
      'token verification failed, Please try again'
    );
  },
};
export default data;
