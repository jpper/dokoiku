const { IncomingWebhook } = require("@slack/webhook");
const url = process.env.SLACK_WEBHOOK_URL;
const repository = "dokoiku";

const webhook = new IncomingWebhook(url);

// subscribeSlack is the main function called by Cloud Functions.
module.exports.subscribeSlack = (pubSubEvent, context) => {
  const build = eventToBuild(pubSubEvent.data);
  try {
    if (build.substitutions.REPO_NAME !== repository) return;
  } catch {
    return;
  }

  // Skip if the current status is not in the status list.
  // Add additional statuses to list if you'd like:
  // QUEUED, WORKING, SUCCESS, FAILURE,
  // INTERNAL_ERROR, TIMEOUT, CANCELLED
  const status = ["QUEUED", "SUCCESS", "FAILURE", "INTERNAL_ERROR", "TIMEOUT"];
  if (status.indexOf(build.status) === -1) {
    return;
  }

  // Send message to Slack.
  let message;
  if (build.status === "QUEUED") {
    message = createSlackMessage4Working(build);
  } else {
    message = createSlackMessage(build);
  }
  webhook.send(message);
};

// eventToBuild transforms pubsub event message to a build object.
const eventToBuild = data => {
  return JSON.parse(Buffer.from(data, "base64").toString());
};

// createSlackMessage creates a message from a build object.
const createSlackMessage = build => {
  const message = {
    text: `Build \`${build.id}\``,
    mrkdwn: true,
    attachments: [
      {
        title: "Build logs",
        title_link: build.logUrl,
        fields: [
          {
            title: "Status",
            value: build.status
          }
        ]
      }
    ]
  };
  return message;
};

const createSlackMessage4Working = build => {
  const message = {
    text: `Merged a new pull request. Please pull origin from staging branch.`
  };
  return message;
};
