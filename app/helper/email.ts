const nodemailer = require("nodemailer");
import { customerEmailTicketCreationTemplate, engineerEmailTicketCreationTemplate } from "./emailTemplate/ticketCreationTemplate";

// create reusable transporter object using the default SMTP transport
let SMTPtransporter = nodemailer.createTransport({
  host: "mail.dgsoft.org",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: 'services@dgsoft.org', // your cPanel email address
    pass: 'dgsoft1!', // your cPanel email password
  },
});

const customerTicketCreationEmail = async (data) => {
  try {
    const { userData, customer, parent_service, ticket_number } = data;
    const { email } = userData;
    const result = await SMTPtransporter.sendMail({
      from: '"DGSOFT®" <services@dgsoft.org>',
      to: `${email}`, // list of receivers  , nihal8351@gmail.com, jitendra.singh31@outlook.com
      subject: `${ticket_number} Ticket Created for ${parent_service}`,
      // text: "text", // plain text body
      html: customerEmailTicketCreationTemplate({ customer, ticket_number }),
      attachments: [
        {
          filename: 'DGSoft-logo.png',
          path: __dirname + '/emailTemplate/logo/DGSoft-logo.png',
          cid: 'logo'
        },
        {
          filename: 'google-maps.png',
          path: __dirname + '/emailTemplate/logo/google-maps.png',
          cid: 'map'
        },
        {
          filename: 'follow.png',
          path: __dirname + '/emailTemplate/logo/follow.png',
          cid: 'follow'
        },
        {
          filename: 'facebook.png',
          path: __dirname + '/emailTemplate/logo/facebook.png',
          cid: 'facebook'
        },
        {
          filename: 'twitter.png',
          path: __dirname + '/emailTemplate/logo/twitter.png',
          cid: 'twitter'
        },
        {
          filename: 'instagram.png',
          path: __dirname + '/emailTemplate/logo/instagram.png',
          cid: 'instagram'
        },
        {
          filename: 'linkedin.png',
          path: __dirname + '/emailTemplate/logo/linkedin.png',
          cid: 'linkedin'
        },
        {
          filename: 'whatsapp.png',
          path: __dirname + '/emailTemplate/logo/whatsapp.png',
          cid: 'whatsapp'
        },
      ]
    });
    console.log("Message sent:", result.messageId);
    return result;
  } catch (error) {
    return error.message;
  }
}

const engineerTicketCreationEmail = async (data) => {
  try {
    const { userData, customer, service_provided, ticket_number, engineerEmail, priority, remark, visit_address, parent_service } = data;
    const result = await SMTPtransporter.sendMail({
      from: '"DGSOFT®" <services@dgsoft.org>',
      to: `${engineerEmail}`,
      subject: `${ticket_number} Ticket Created for ${parent_service}`,
      html: engineerEmailTicketCreationTemplate({ customer, ticket_number, service_provided, priority, remark, visit_address, parent_service, userData }),
      attachments: [
        {
          filename: 'DGSoft-logo.png',
          path: __dirname + '/emailTemplate/logo/DGSoft-logo.png',
          cid: 'logo'
        },
        {
          filename: 'google-maps.png',
          path: __dirname + '/emailTemplate/logo/google-maps.png',
          cid: 'map'
        },
        {
          filename: 'follow.png',
          path: __dirname + '/emailTemplate/logo/follow.png',
          cid: 'follow'
        },
        {
          filename: 'facebook.png',
          path: __dirname + '/emailTemplate/logo/facebook.png',
          cid: 'facebook'
        },
        {
          filename: 'twitter.png',
          path: __dirname + '/emailTemplate/logo/twitter.png',
          cid: 'twitter'
        },
        {
          filename: 'instagram.png',
          path: __dirname + '/emailTemplate/logo/instagram.png',
          cid: 'instagram'
        },
        {
          filename: 'linkedin.png',
          path: __dirname + '/emailTemplate/logo/linkedin.png',
          cid: 'linkedin'
        },
        {
          filename: 'whatsapp.png',
          path: __dirname + '/emailTemplate/logo/whatsapp.png',
          cid: 'whatsapp'
        },
      ]
    });
    console.log("Message sent:", result);
    return result;
  } catch (error) {
    return error.message;
  }
}

export { customerTicketCreationEmail, engineerTicketCreationEmail };
