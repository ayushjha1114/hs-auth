// const path = require('path');
// declare function require(name: string);
// const nodemailer = require('nodemailer');
// import url from '../config/environments/dev';
// // const mailConfig = global['configuration'].email;
// import emailConfig from '../config/email';
// import { EmailTemplate } from 'email-templates';
// import logger from '../lib/logger';
// import commenHelper from '../helper'
// const env = process.env.NODE_ENV;
// let AWS = require('aws-sdk');


// AWS.config.update({
//   accessKeyId: mailConfig.accessKeyId,
//   secretAccessKey: mailConfig.secretAccessKey,
//   region: mailConfig.region,
// });


// // create Nodemailer SES transporter
// let transport = nodemailer.createTransport({
//   SES: new AWS.SES({
//     apiVersion: '2012-10-17',
//   }),
// });

// const Email = {
//   welcome(user) {
//     if (user.email) {
//       let templateDir = path.join('app/global/templates', 'emails', 'welcome-email');
//       let welcomeEmail = new EmailTemplate(templateDir);
//       welcomeEmail.render({ user: user, activate_url: `${url.API}/auth/activate/${user.uuid}` }, (err, result) => {
//         if (result) {
//           transport.sendMail(
//             {
//               from: emailConfig.global.from,
//               to: user.email,
//               subject: emailConfig.welcome.subject,
//               html: result.html,
//             }, (err, info) => {

//             }
//           );
//         }
//       });
//     }
//   },
//   password_reset(user, password) {
//     if (user.email) {
//       let templateDir = path.join('app/global/templates', 'emails', 'password-reset-email');
//       let passwordResetEmail = new EmailTemplate(templateDir);
//       passwordResetEmail.render({ user: user, login_url: `${url.FE}/auth/login`, password: password }, (err, result) => {
//         if (result) {
//           transport.sendMail(
//             {
//               from: emailConfig.global.from,
//               to: user.email,
//               subject: emailConfig.password_reset.subject,
//               html: result.html,
//             }, (err, info) => {
//               // some error occurred...
//             }
//           );
//         }
//       });
//     }
//     if (user.phone_verified) {
//       // Twillo.password_reset_notification(user.phone);
//     }

//   },
//   update_email(email, id, name) {
//     if (email) {
//       let templateDir = path.join('app/global/templates', 'emails', 'email-update');
//       let passwordResetEmail = new EmailTemplate(templateDir);


//       passwordResetEmail.render({ name, activate_url: `${commenHelper.feUrl(process.env.NODE_ENV)}/email-verify/${id}` }, (err, result) => {
//         if (result) {
//           transport.sendMail(
//             {
//               from: emailConfig.global.from,
//               to: email,
//               subject: emailConfig.update_email.subject,
//               html: result.html,
//             }, (err, info) => {
//               if (err) logger.info('update email error: ', err);
//               else logger.info('update email success');
//             }
//           );
//         }

//       });
//     }
//   },
// };
// export default Email;
