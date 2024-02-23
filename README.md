# UA RMC Robotics Website

This is the website for the University of Akron's Robotic Mining Competition team. It is built using SvelteKit and integrates with UA-Events-Bot and CouchDB operating on https://leboeuflasing.ddns.net/ for the backend integration with the discord server.

## Developers

Once you've cloned the repo and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## NOTICE: Production Auto-Deploy

**_ DO NOT PUSH TO `master` UNLESS YOU ARE READY TO DEPLOY TO PRODUCTION. _**

This repository is set up to auto-deploy to the production server on push to the `master` branch. Please be careful when pushing to `master` as it will immediately deploy to the production server.

Please branch off of `dev` and submit a pull request to merge into `dev` when you are ready to merge your changes into the development branch. Once the changes are tested and ready to go live, the team lead will merge `dev` into `master` to deploy to the production server.

## Backend Integration Information

The contact form submits data to a couchDB server running on https://leboeuflasing.ddns.net/. The database stores data in JSON notation. There is a JS interaction class in components.

The contact form table of the database is credentials protected to against spam, but is by NO MEANS secure. No sensitive or identifiable information should be stored in the database.
The rest of the database is not protected. Contact Eli Bukoski (elimbukoski@gmail.com) for the credentials to access the database, or to get new tables/credentials set up.

Additional features may need to bet written in the future to interact with the database further.

The events page pulls a json file from the web server at https://leboeuflasing.ddns.net/ and formats the information into cards. The json file is not protected, and can be accessed by anyone. The json file is automatically updated by the the EventsBot program, which is run on the same server as the couchDB server. It pulls the information from the events tab of the robotics discord server. The bot is not currently set up to pull from any other source, but could be modified to do so in the future.

In turn, the EventsBot pulls from the couchDB server to get contact form submissions and posts them back into the discord server for members to respond to.
