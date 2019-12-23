const { region } = require("firebase-functions");
const { credential } = require("firebase-admin");
const axios = require("axios");
const { IncomingWebhook } = require("@slack/webhook");

const GCLOUD_REGION = "asia-east2";
const GCLOUD_TIMEZONE = "Asia/Tokyo";
const GCLOUD_PROJECT_ID = "project-gopherdor";
const GCLOUD_BACKET_NAME = "gopherdor-firestore-backup";

const url = process.env.SLACK_WEBHOOK_URL;
const webhook = new IncomingWebhook(url);

module.exports.backupFirestoreToStorage = region(GCLOUD_REGION)
  .pubsub.schedule("0 3 * * *")
  .timeZone(GCLOUD_TIMEZONE)
  .onRun(async () => {
    try {
      const accessToken = await credential
        .applicationDefault()
        .getAccessToken()
        .then(result => result.access_token);
      const response = await axios.post(
        `https://firestore.googleapis.com/v1/projects/${GCLOUD_PROJECT_ID}/databases/(default):exportDocuments`,
        { outputUriPrefix: `gs://${GCLOUD_BACKET_NAME}` },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      const message = {
        text: `Successfully backup FireStore data to Cloud Storage in GCP.`
      };
      webhook.send(message);
      console.log(response);
    } catch (err) {
      console.error(err);
    }
  });

// const functions = require("firebase-functions");
// const firestore = require("@google-cloud/firestore");
// const client = new firestore.v1.FirestoreAdminClient();

// const GCLOUD_REGION = "asia-east2";
// const GCLOUD_TIMEZONE = "Asia/Tokyo";
// const GCLOUD_PROJECT_ID = "project-gopherdor";
// const GCLOUD_BACKET_NAME = "gs://gopherdor-firestore-backup";

// exports.scheduledFirestoreExport = functions
//   .region(GCLOUD_REGION)
//   .pubsub.schedule("0 3 * * *")
//   .timeZone(GCLOUD_TIMEZONE)
//   .onRun(context => {
//     const databaseName = client.databasePath(GCLOUD_PROJECT_ID, "(default)");

//     return client
//       .exportDocuments({
//         name: databaseName,
//         outputUriPrefix: GCLOUD_BACKET_NAME,
//         // Leave collectionIds empty to export all collections
//         // or set to a list of collection IDs to export,
//         // collectionIds: ['users', 'posts']
//         collectionIds: []
//       })
//       .then(responses => {
//         const response = responses[0];
//         console.log(`Operation Name: ${response["name"]}`);
//         return response;
//       })
//       .catch(err => {
//         console.error(err);
//         throw new Error("Export operation failed");
//       });
//   });
