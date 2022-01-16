const nodemailer = require("nodemailer");
const { whisp, yell, ignore } = require("./whisper");

/***********************************************************************************************************
 * _SERVER_EMAIL: mailExample.service@server.com
 * _SERVER_PASSWORD: Password_of_mailExample.service@server.com
 * _TESTER_EMAIL: email address of the developper on which he want to receive an email if the
 * user did not provide his email from the form
 *
 * _DOMAIN_NAME: 'superWebsite.com' (only the domain, without the http://)
 * _HOST_NAME: 'Super Website' (only the name of the website)
/**********************************************************************************************************/
// prettier-ignore
const { _SERVER_EMAIL, _SERVER_PASSWORD, _TESTER_EMAIL, _DOMAIN_NAME, _HOST_NAME } = require("../config/settings").email;
const realURL = require("../config/settings").server.url;

/****************************************** Template Initializer ******************************************
 * _HOST_NAME: 'Super Website', only the name of the website
 * _DOMAIN_NAME: 'SuperWebsite.com', only the domain, without the http://
 *
 * init_HOST_NAME: example : "Super Website"
 * init_DOMAIN_NAME: example: "superWebsite.com"
 * initUserEmail: if it's not provided from the front-end, it will take the email address of the tester
 *
 * Note: The tester will be the tester user who will receive an email test from the nodeMailer
 *
 * initSubject: it describe the Object of the email
 * initText: the content of the email, but with pure text format
 * initHTML: the content of the email, but with HTML format
 * initMail: it initialize the Subject, and the content of the email, with Text and HTML format
 * initMailTransporter: it specify which service to use (ex: 'gmail'), and specify the login & the password
/**********************************************************************************************************/

// prettier-ignore
const init_HOST_NAME = ( websiteName ) => websiteName ? websiteName : `"${_HOST_NAME} 👻" <${_SERVER_EMAIL}>`
const init_DOMAIN_NAME = (websiteURL) =>
  websiteURL ? websiteURL : _DOMAIN_NAME;

const initUserEmail = (userEmail) => (userEmail ? userEmail : _TESTER_EMAIL);

// prettier-ignore
const initSubject = ({ subject }, template) => {
  if (subject) return subject;
  if (template === "signup") return `Welcome to ${_HOST_NAME}`;
  if (template === "forgotpassword") return `[${_HOST_NAME}] Reset password instructions`;

  if(template === "userbanned"){
    ignore()
  }

  if(template === "itembanned"){
    ignore()
  }

};

// prettier-ignore
const initText = ({textFormat, fullName, websiteName, websiteURL, hash_link}, template) => {
  websiteName = init_HOST_NAME(websiteName)
  websiteURL = init_DOMAIN_NAME(websiteURL)

  if (textFormat) return textFormat;

  if (template === "signup") {
    return `Dear ${fullName}, Welcome to ${websiteName} Website!
    You are now part of the ${websiteName} family! Get ready to depart on an exciting journey with us!
    To make things extra special for you, starting today, we will send you a series of exclusive emails with amazing tips and tricks to get the most out of your account.
    Get ready!
    Not sure where to start? Make sure to visit our F.A.Q section!
    If you prefer something more personal, you can always contact our support team through live chat or at ${_SERVER_EMAIL}.
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
  websiteName = init_HOST_NAME(websiteName)
  websiteURL = init_DOMAIN_NAME(websiteURL)

  if (htmlFormat) return htmlFormat;

  if (template === "signup") {
    return `<p>Dear ${fullName}, Welcome to ${websiteName} Website!</p>
    <p>You are now part of the ${websiteName} family! Get ready to depart on an exciting journey with us!</p>
    <p>To make things extra special for you, starting today, we will send you a series of exclusive emails with amazing tips and tricks to get the most out of your account.</p>
    <p>Get ready!</p>
    <p>Not sure where to start? Make sure to visit our F.A.Q section!</p>
    <p>If you prefer something more personal, you can always contact our support team through live chat or at ${_SERVER_EMAIL}.</p>
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
};

// prettier-ignore
const initMail = (params, template) => {
  return {
    from: init_HOST_NAME(params), // sender address
    to: initUserEmail(params.email), // list of receiver(s)
    subject: initSubject(params, template), // Subject line
    text: initText(params, template), // plain text body
    html: initHTML(params, template), // html body
  };
};

const initMailTransporter = (user, pass, service) => ({
  service,
  auth: { user, pass },
});

// prettier-ignore
module.exports = {
  gMailer: async (params, template) => {
    whisp("mailerParams (inside ): ",params)
    // let params = { websiteName, subject, textFormat, htmlFormat, fullName, websiteURL, hash_link };
    const newMail = initMail(params, template);

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport(initMailTransporter(_SERVER_EMAIL, _SERVER_PASSWORD, "gmail"));

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
