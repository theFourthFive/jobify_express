const nodemailer = require("nodemailer");
const { whisp, yell, ignore } = require("./whisper");

// prettier-ignore
const { serverEmail, serverPassword, testerEmail, domainName, hostName, realURL } = require("../config/settings").email;

// prettier-ignore
const initHostName = ( websiteName ) => websiteName ? websiteName : `"${hostName} 👻" <${serverEmail}>`
const initDomainName = ( websiteURL ) =>
  websiteURL ? websiteURL : domainName;

const initUserEmail = (userEmail) => (userEmail ? userEmail : testerEmail);

// prettier-ignore
const initSubject = ({ subject }, template) => {
  if (subject) return subject;
  if (template === "signup") return `Welcome to ${hostName}`;
  if (template === "forgotpassword") return `[${hostName}] Reset password instructions`;

  if(template === "userbanned"){
    ignore()
  }

  if(template === "itembanned"){
    ignore()
  }

};

// prettier-ignore
const initText = ({textFormat, fullName, websiteName, websiteURL, hash_link}, template) => {
  websiteName = initHostName(websiteName)
  websiteURL = initDomainName(websiteURL)

  if (textFormat) return textFormat;

  if (template === "signup") {
    return `Dear ${fullName}, Welcome to ${websiteName} Website!
    You are now part of the ${websiteName} family! Get ready to depart on an exciting journey with us!
    To make things extra special for you, starting today, we will send you a series of exclusive emails with amazing tips and tricks to get the most out of your account.
    Get ready!
    Not sure where to start? Make sure to visit our F.A.Q section!
    If you prefer something more personal, you can always contact our support team through live chat or at ${serverEmail}.
    Best,
    The ${websiteName} team.`;
  }

  if (template === "forgotpassword") {
    return `
    Hello ${fullName}
    Someone has requested a link to change your password at ${websiteURL}, and you can do this through the link below.
    Change my password:
    ${realURL}/resetpassword/${hash_link}
    If you didn't request this, please ignore this email.
    Your password won't change until you access the link above and create a new one.`;
  }

  if(template === "userbanned"){
    ignore()
  }

  if(template === "itembanned"){
    ignore()
  }
};

// prettier-ignore
const initHTML = ({htmlFormat, fullName, websiteName, websiteURL, hash_link}, template) => {
  websiteName = initHostName(websiteName)
  websiteURL = initDomainName(websiteURL)

  if (htmlFormat) return htmlFormat;

  if (template === "signup") {
    return `<p>Dear ${fullName}, Welcome to ${websiteName} Website!</p>
    <p>You are now part of the ${websiteName} family! Get ready to depart on an exciting journey with us!</p>
    <p>To make things extra special for you, starting today, we will send you a series of exclusive emails with amazing tips and tricks to get the most out of your account.</p>
    <p>Get ready!</p>
    <p>Not sure where to start? Make sure to visit our F.A.Q section!</p>
    <p>If you prefer something more personal, you can always contact our support team through live chat or at ${serverEmail}.</p>
    <p>Best,</p>
    <p>The ${websiteName} team</p>`;
  }

  if (template === "forgotpassword") {
    return `
    <p>Hello ${fullName}</p>
    <p>Someone has requested a link to change your password at <a href="${realURL}">${websiteURL}</a>, and you can do this through the link below.</p>
    <a href="${realURL}/auth/resetpassword/${hash_link}">Change my password</a>
    <p>If you didn't request this, please ignore this email.</p>
    <p>Your password won't change until you access the link above and create a new one.</p>`;
  }

  if(template === "userbanned"){
    ignore()
  }

  if(template === "itembanned"){
    ignore()
  }
};

// prettier-ignore
const initMail = (params, template) => {
  return {
    from: initHostName(params), // sender address
    to: initUserEmail(params.email), // list of receiver(s)
    subject: initSubject(params, template), // Subject line
    text: initText(params, template), // plain text body
    html: initHTML(params, template), // html body
  };
};

const initGmailTransporter = (user, pass) => ({
  service: "gmail",
  auth: { user, pass },
});

// prettier-ignore
module.exports = {
  gMailer: async (params, template) => {
    // let params = { websiteName, subject, textFormat, htmlFormat, fullName, websiteURL, hash_link };
    const newMail = initMail(params, template);

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport(initGmailTransporter(serverEmail, serverPassword));

    try {
      // send mail with defined transport object
      let sentEmail = await transporter.sendMail(newMail);

      whisp("Message sent: %s", sentEmail.messageId);
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

      // Preview only available when sending through an Ethereal account
      whisp("Preview URL: %s", nodemailer.getTestMessageUrl(sentEmail));
      // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    } catch (error) {
      yell(error);
    }
  },
};
