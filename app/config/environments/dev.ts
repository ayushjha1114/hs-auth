import 'dotenv/config';
const configuration: any = {};

configuration.pgsql = {
  host: process.env.PGSQL_HOST,
  database_name: process.env.PGSQL_DATABASE_NAME,
  username: process.env.PGSQL_USERNAME,
  password: process.env.PGSQL_PASSWORD,
  port: process.env.PGSQL_PORT
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
configuration.url = {
  FE: process.env.FE,
  API: process.env.API,
}
configuration.admin = {
  cognitoClientId: process.env.COGNITO_CLIENT_ID,
  cognitoIdpName: process.env.COGNITO_IDP_NAME
}

export default configuration;