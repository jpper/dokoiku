```bash
gcloud functions deploy subscribeSlack \
--trigger-topic cloud-builds \
--runtime nodejs10 \
--region asia-northeast1 \
--project dokoiku-staging \
--set-env-vars "SLACK_WEBHOOK_URL=[YOUR_SLACK_WEBHOOK_URL]"
```
