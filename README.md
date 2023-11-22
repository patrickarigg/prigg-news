# PRigg News API
## Description
This project creates and tests an api for a news database. A live version is currently hosted at https://prigg-news-api.onrender.com/api/.

The news database contains tables for articles, comments, topics and users which the API provides access to through the endpoints described in the endpoints.json file.

## Dependencies
- Node v20.5.1 or later
- Postgres 16.0 or later

## Setup
To create a locally hosted API, follow the instructions below.

1. Clone the repo:
``` bash
git clone https://github.com/patrickarigg/prigg-news
```
2. Install the node package dependencies:
``` bash
npm install
```
3. Set up the environment variables with the correct database information by creating two files - **.env.development** and **.env.test** - and populated them as follows:
``` bash
.env.development -> 'PGDATABASE=nc_news'
.env.test -> 'PGDATABASE=nc_news_test'
```
4. Create the local test and development databases:
``` bash
npm run setup-dbs
```
5. Seed the local development database:
``` bash
npm run seed
```
6. Seed a test database and run all tests:
``` bash
npm test
```
