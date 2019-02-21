This is the source code for the "Who's Hiring" newsletter feature for [Frontend Jobs](https://www.frontendjobs.tech).

It's built with [Serverless](https://serverless.com/) and [AWS Lambda](https://aws.amazon.com/lambda/). A longer-term writeup is coming soon, but here's how it works in the meantime.

Two functions have been set up with recurring _schedules_, defined by cron:
- A daily task, running every day at 9AM PST
- A weekly task, running every Monday at 9AM PST

This task does the following:

1) Retrieves the RSS feed for Frontend Jobs
2) Determine _which_ task is running, and use it to filter jobs. For instance, if the _daily_ schedule is running, find posts in the last day. If no jobs are found, bail! Otherwise...
3) Invoke the Mailchimp list function, which returns a list of users from our Mailchimp list via their API - this is segmented into "daily" and "weekly" users ([subscribe here!](https://xyz.us16.list-manage.com/subscribe/post?u=0b8a0e873d096aad47c111571&id=1b07ed5d5b)).
4) For each user, call the Send Email function, which constructs an email (HTML template constructed with [mjml](https://mjml.io)) and populates user-specific info (an unsubscribe link), before sending it to the user using SES.

---

[This project is licensed under the GPLv3 license](https://www.gnu.org/licenses/gpl-3.0.en.html) - feel free to remix it for your own project, contribute to fix any issues you see, etc. It's been a fun project to build, and I definitely have future plans to make it better! <3
