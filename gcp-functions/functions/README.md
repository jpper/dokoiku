# Cloud Functions for Firebase (FireStore Backup)

## Setup Cloud Functions

```bash
firebase init functions
```

```bash
firebase deploy --only functions:backupFirestoreToStorage

gcloud projects add-iam-policy-binding project-gopherdor \
--member serviceAccount:project-gopherdor@appspot.gserviceaccount.com \
--role roles/datastore.importExportAdmin

gsutil iam ch serviceAccount:project-gopherdor@appspot.gserviceaccount.com:admin \
gs://gopherdor-firestore-backup
```

## Manual export & import fireStore data

### Export

```bash
gcloud config set project project-gopherdor
gcloud firestore export gs://gopherdor-firestore-backup
```

### Import

```bash
gcloud config set project project-gopherdor
gcloud firestore import gs://gopherdor-firestore-backup/2019-12-22T12:07:48_23056/
```

## Reference

https://firebase.google.com/docs/firestore/manage-data/export-import
