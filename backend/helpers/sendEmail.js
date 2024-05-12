const nodemailer = require("nodemailer");
const ejs = require('ejs');

let sendEmail = ({view,data,from,to,subject}) => {
    var transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "00d6486c058ca5",
          pass: "5235312898201a"
        }
      });

      ejs.renderFile('./views/'+view+'.ejs',data,async (err,dataString) => {
        console.log(err);
                const info = await transport.sendMail({
                  from,
                  to,
                  subject,
                  html: dataString, // html body
                });
                console.log("Message sent: %s", info.messageId);
      })
}

module.exports = sendEmail;