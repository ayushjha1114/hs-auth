/* eslint quote-props: 0 */
require('dotenv').config();
export { }
const configuration: any = {};

configuration.pgsql = {
  pgsql_connection_url: process.env.PGSQL_CONNECTION_URL,
  pgsql_host: process.env.PGSQL_HOST,
  pgsql_database_name: process.env.PGSQL_DATABASE_NAME,
  pgsql_username: process.env.PGSQL_USERNAME,
  pgsql_password: process.env.PGSQL_PASSWORD,
  pgsql_port: process.env.PGSQL_PORT
}

configuration.URL = {
  frontEnd: process.env.FE_URL
}
configuration.otp = {
  apiUrl: process.env.MMX_API_URL,
  auth: {
    username: process.env.MMX_USER,
    password: process.env.MMX_PASSWORD,
  },
  retryCountLimit: process.env.RETRY_OTP_COUNT_LIMIT,
  retryIntervalLimit: process.env.RETRY_OTP_INTERVAL_LIMIT,
  invalidCountLimit: process.env.INVALID_OTP_COUNT_LIMIT,
  invalidIntervalLimit: process.env.INVALID_OTP_INTERVAL_LIMIT,
}
configuration.email = {
  apiKey: process.env.API_KEY,
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  accessKeyId: process.env.SES_ACCESS_KEY_ID,
  secretAccessKey: process.env.SES_SECRET_ACCESS_KEY,
  region: process.env.SES_REGION,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  }
}
// configuration.twilio = {
//   sid: process.env.SID,
//   token: process.env.TOKEN,
//   phone: process.env.PHONE,
// }
configuration.url = {
  FE: process.env.FE,
  API: process.env.API,
}
configuration.admin = {
  cognitoClientId: process.env.COGNITO_CLIENT_ID,
  cognitoIdpName: process.env.COGNITO_IDP_NAME
}
// configuration.uploadpath = {
//   uploaddir: process.env.UPLOAD_DIR,
//   profiledir: process.env.PROFILE_PICTURE_DIR
// }

module.exports = configuration;