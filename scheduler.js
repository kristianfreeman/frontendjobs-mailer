const fetch = require("node-fetch");
const mjml2html = require("mjml");

const scheduler = async (event, context, callback) => {
  const feedUrl = process.env.FEED;
  const feedResp = await fetch(feedUrl);
  const { items } = await feedResp.json();
  let response;

  if (items.length > 0) {
    const usersUrl = process.env.USERS;
    const usersResp = await fetch(usersUrl);
    const { users } = await usersResp.json();

    const date = new Date().toLocaleString("en-us", {
      month: "long",
      day: "numeric",
      year: "numeric"
    });

    const jobsString = items
      .map(({ title, link }) => [title, link].join("\n"))
      .join("\n\n");
    const text = `Here's who's hiring on Frontend Jobs, for ${date}:\n\n${jobsString}`;

    const jobsHtml = items
      .map(({ title, link }) => `<li><a href="${link}">${title}</a></li>`)
      .join("");

    const { html, errors } = mjml2html(`
      <mjml>
        <mj-head>
          <mj-title>Hello world</mj-title>
          <mj-font name="Roboto" href="https://fonts.googleapis.com/css?family=Roboto:300,500"></mj-font>
          <mj-attributes>
            <mj-all font-family="Roboto, Helvetica, sans-serif"></mj-all>
            <mj-text font-weight="300" font-size="16px" color="#616161" line-height="24px"></mj-text>
            <mj-section padding="0px"></mj-section>
          </mj-attributes>
        </mj-head>
        <mj-body>
          <mj-section>
            <mj-column>
              <mj-text align="center" font-weight="500" font-size="18px" padding-top="40px">FRONTEND JOBS</mj-text>
              <mj-divider border-width="2px" border-color="#616161"></mj-divider>
              <mj-divider border-width="2px" border-color="#616161" width="45%"></mj-divider>
              <mj-text>
                <h1>Who's hiring: ${date}</h1>
                <p>
                  ${jobsHtml}
                </p>
              </mj-text>
              <mj-divider border-width="1px" border-color="#E0E0E0"></mj-divider>
              <mj-text>
                <p><a href="MANAGE_URL">Manage your account</a></p>
              </mj-text>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `);

    if (errors.length) {
      response = {
        statusCode: 200,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: errors.join("")
      };
    } else {
      try {
        users.forEach(user => {
          const body = {
            subject: `Who's hiring? Frontend Jobs: ${date}`,
            textBody: jobsString,
            htmlBody: html,
            to: user.email_address,
            emailId: user.unique_email_id,
            from: "Frontend Jobs <support@frontendjobs.tech>"
          };

          console.log(`Sending email to ${user.email_address}`);
          fetch(process.env.SEND_EMAIL_URL, {
            method: "POST",
            body: JSON.stringify(body)
          });
        });

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
          body: "Something went wrong"
        };
      }
    }
  } else {
    response = {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ items })
    };
  }

  callback(null, response);
};

module.exports = scheduler;
