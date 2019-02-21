const Mailchimp = require("mailchimp-api-v3");
const mailchimp = new Mailchimp(process.env.MAILCHIMP_API_KEY);

const mailchimp_list = async (event, context, callback) => {
  const listId = process.env.MAILCHIMP_LIST;
  const segmentId = process.env.SEGMENT;
  const interest_category_id = process.env.MAILCHIMP_CATEGORY;

  const result = await mailchimp.get(`/lists/${listId}/members`, {
    count: 500,
    interest_category_id,
    interest_match: "all",
    interest_ids: segmentId
  });

  const base_url = process.env.MAILCHIMP_BASE_URL;
  const users = result.members.map(({ email_address, unique_email_id }) => ({
    email_address,
    unique_email_id,
    management_url: base_url + unique_email_id
  }));

  response = {
    statusCode: 200,
    headers: { "Access-Control-Allow-Origin": "*" },
    body: JSON.stringify({ users })
  };

  callback(null, response);
};

module.exports = mailchimp_list;
