# bful.netsam.com Payload CMS Backup

This folder contains a MongoDB database backup and uploaded media backup from the AWS Lightsail deployment of the Payload CMS site.

## Source

```text
Site: http://bful.netsam.com/
AWS Lightsail instance: payload-cms-adnan-aws
Server IP: 16.192.74.55
MongoDB Docker container: payload-mongo
MongoDB database: payload-cms
Media folder on server: /opt/payload/public-media
```

## Files

```text
payload-cms-mongodb-backup-20260729T222849Z.archive.gz
payload-cms-media-backup-20260731T034957Z.tar.gz
```

## MongoDB Backup Format

The database backup was created with:

```bash
mongodump --db payload-cms --archive=<file>.archive.gz --gzip
```

This is a portable MongoDB dump archive. It should be restored with `mongorestore`, not copied directly into MongoDB's raw data folder.

## Restore MongoDB Locally

Example restore to a local database named `payloadcmsLocalAdnan`:

```powershell
mongorestore `
  --uri="mongodb://127.0.0.1:27017" `
  --drop `
  --gzip `
  --archive="payload-cms-mongodb-backup-20260729T222849Z.archive.gz" `
  --nsFrom="payload-cms.*" `
  --nsTo="payloadcmsLocalAdnan.*"
```

If `mongorestore` is not in PATH, run it with the full MongoDB Database Tools path, for example:

```powershell
& "C:\Program Files\MongoDB\Tools\100\bin\mongorestore.exe" `
  --uri="mongodb://127.0.0.1:27017" `
  --drop `
  --gzip `
  --archive="payload-cms-mongodb-backup-20260729T222849Z.archive.gz" `
  --nsFrom="payload-cms.*" `
  --nsTo="payloadcmsLocalAdnan.*"
```

## Restore Media Files

The media archive contains the server folder:

```text
public-media/
```

Extract it and copy the files into the Payload media folder used by the deployment.

For a local Payload CMS project, this is commonly:

```text
public/media
```

For the AWS Lightsail deployment, the server path is:

```text
/opt/payload/public-media
```

Example Linux restore:

```bash
tar -xzf payload-cms-media-backup-20260731T034957Z.tar.gz
sudo mkdir -p /opt/payload/public-media
sudo cp -a public-media/. /opt/payload/public-media/
sudo chown -R 1001:1001 /opt/payload/public-media
```

## Production Database Recommendation

For this Payload CMS site, MongoDB is the recommended production database.

SQLite is useful for local development, prototypes, and small single-user demos, but it is not ideal for production here because:

- Payload CMS content editing is multi-user and document-heavy.
- File uploads and page-builder content benefit from a server database.
- SQLite is file-based and harder to scale, back up, and operate safely in containers.
- Azure Container Apps, Kubernetes, and similar platforms often replace containers, so a local SQLite file can be lost unless carefully mounted.
- Concurrent writes and production operational tooling are better with MongoDB or PostgreSQL.

Good production alternatives:

```text
MongoDB Atlas
Azure Cosmos DB for MongoDB
Self-hosted MongoDB with persistent volume
PostgreSQL, if the Payload project is converted to Payload's PostgreSQL adapter
```

Best practical choice for this project:

```text
MongoDB for production, SQLite only for local development/testing.
```

