# Northcoders House of Games API

## Background

We will be building an API for the purpose of accessing application data programmatically. The intention here is to mimic the building of a real world backend service (such as reddit) which should provide this information to the front end architecture.

Your database will be PSQL, and you will interact with it using [node-postgres](https://node-postgres.com/).

## Getting started

In order to gain necessary environment variables you will be required to create two .env files.

1. Create a file called .env.development

   This file should contain the following ---

   PGDATABASE=nc_games

2. Create a file called .env.test

   This file should contain the following ---

   PGDATABASE=nc_games_test

Once you have cloned this repo and added the above files, you should ensure your .gitignore file contains the following ---

node_modules

.env.\*

Once this is complete, you should now be able to successfully connect to the two databases locally.
