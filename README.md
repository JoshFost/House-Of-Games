# Northcoders House of Games API

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
