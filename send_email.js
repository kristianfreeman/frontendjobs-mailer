var AWS = require("aws-sdk");

const sendSES = async (subject, textBody, htmlBody, to, from) => {
  AWS.config.region = "us-east-1";
  var ses = new AWS.SES();
  var params = {
    Destination: { ToAddresses: to },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: htmlBody
        },
        Text: {
          Charset: "UTF-8",
          Data: textBody
        }
      },
      Subject: {
        Charset: "UTF-8",
        Data: subject
      }
    },
    Source: from,
    Tags: [
      {
        Name: "source",
        Value: "AWS"
      }
    ]
  };

  ses.sendEmail(params, (err, data) => {
    if (err) console.log(err, err.stack);
    else console.log("Sent email"); // successful response
  });
};

const send_email = async (event, context, callback) => {
  const body = JSON.parse(event.body);

  const { subject, textBody, htmlBody, to, from, emailId } = body;

  const baseUrl = process.env.MAILCHIMP_BASE_URL;

  const text = textBody.replace(
    "MANAGE_URL",
    `${process.env.MAILCHIMP_BASE_URL}${emailId}`
  );
  const html = htmlBody.replace(
    "MANAGE_URL",
    `${process.env.MAILCHIMP_BASE_URL}${emailId}`
  );

  try {
    await sendSES(subject, text, html, [to], from);

    response = {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: "OK"
    };
  } catch (err) {
    console.log(err);
    response = {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: err
    };
  }

  callback(null, response);
};

module.exports = send_email;
