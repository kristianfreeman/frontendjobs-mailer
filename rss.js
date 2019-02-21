const moment = require("moment");
const Parser = require("rss-parser");
const parser = new Parser();

const retrievePosts = async (url, schedule = "daily") => {
  const feed = await parser.parseURL(url);
  let items;
  let since;

  switch (schedule) {
    case "daily":
      since = moment().subtract(1, "day");
      items = feed.items.filter(item => {
        const date = moment(item.isoDate);
        return date.isAfter(since);
      });
      return items;
    case "weekly":
      since = moment().subtract(1, "week");
      items = feed.items.filter(item => {
        const date = moment(item.isoDate);
        return date.isAfter(since);
      });
      console.log(feed.items);
      console.log(items);
      return items;
    default:
      return feed.items;
  }
};

const format = ({ title, link }) => ({ title, link });

const rss = async (event, context, callback) => {
  const schedule = process.env.SCHEDULE;
  const url = process.env.URL;
  const retrieved = await retrievePosts(url, schedule);
  const items = retrieved.map(format);

  const response = {
    statusCode: 200,
    headers: { "Access-Control-Allow-Origin": "*" },
    body: JSON.stringify({ items })
  };

  callback(null, response);
};

module.exports = rss;
