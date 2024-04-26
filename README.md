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

** DO NOT PUSH TO `master` UNLESS YOU ARE READY TO DEPLOY TO PRODUCTION. **

This repository is set up to auto-deploy to the production server on push to the `master` branch. Please be careful when pushing to `master` as it will immediately deploy to the production server.

Please branch off of `dev` and submit a pull request to merge into `dev` when you are ready to merge your changes into the development branch. Once the changes are tested and ready to go live, the team lead will merge `dev` into `master` to deploy to the production server.

### Testing

Please tes your changes visually and functionally before submitting a pull request. The website should look and function as expected. If you are adding new features, please test them thoroughly to ensure they work as expected.

Once a pull request has been submitted, the team should test building the website for production. Every page is pre-rendered and minified by svelte, ensure this process works locally before merging into `master`.
Run the command with `npm run build` to build the website for production. If the build fails, the website will not deploy to production successfully.

### Images

Images are stored in the `src/lib/images` directory. When adding images, please ensure that they are compressed and optimized for the web. You can run the program `src/lib/images/0ImgResize.py` to compress and resize images. This program uses the `Pillow` library, which can be installed with `pip install Pillow`.

Images are resized to 1800x* and compressed to 1/2 of their original size. The program will overwrite the original images, so be sure to make a backup if you need to keep the original images. This compression and resizing is done to reduce the size of the images and improve the performance of the website on images bigger than 1800x*.

Images can be excluded from the resizing and compression by adding them to the `excluded` list in the `0ResizeProperties.csv` file. This is useful for images that are already optimized or are small enough that resizing and compressing them would not improve performance, or where the image quality is important.

### Including Images in Routes

The `src/lib/images` folder is not directly accessible by the website. To use them, they must be included in each route page within the initializing script. Then using svelte syntax, the images can be included in the HTML.

```html
<script>
	import image1 from '$lib/images/image1.jpg';
	import image2 from '$lib/images/image2.jpg';
</script>

<img src="{image1}" alt="Image 1" />
<img src="{image2}" alt="Image 2" />
```

Images in the header are an anomalous, they must be placed in the /static/headerImages folder. They aren't preprocessed by svelte, so with the way dynamic requests work, they must be placed in the static folder.

## Data Based Components (Cards)

The website uses data based components to generate cards for events and team members, and robot descriptions. The data is stored in JSON variables in components, and should be updated there. The data is then passed to the card component, which generates the cards based on the data in some cases. Note images must be imported like usual, and the image path is passed to the card component via JSON.

```html
<script>
	import UALogo from '$lib/images/ua-logo.png';

	const Sponsors = [
		{
			name: 'UA',
			image: UALogo,
			link: 'https://www.uakron.edu/'
		}
	];
</script>

<!--
		Card Component
	 -->
```

## Backend Integration Information

The contact form submits data to a couchDB server running on https://leboeuflasing.ddns.net/. The database stores data in JSON notation. There is a JS interaction class in components.

The contact form table of the database is credentials protected to against spam, but is by NO MEANS secure. No sensitive or identifiable information should be stored in the database.
The rest of the database is not protected. Contact Eli Bukoski (elimbukoski@gmail.com) for the credentials to access the database, or to get new tables/credentials set up.

Additional features may need to bet written in the future to interact with the database further.

The events page pulls a json file from the web server at https://leboeuflasing.ddns.net/ and formats the information into cards. The json file is not protected, and can be accessed by anyone. The json file is automatically updated by the the EventsBot program, which is run on the same server as the couchDB server. It pulls the information from the events tab of the robotics discord server. The bot is not currently set up to pull from any other source, but could be modified to do so in the future.

In turn, the EventsBot pulls from the couchDB server to get contact form submissions and posts them back into the discord server for members to respond to.

## Updating the Website dependencies

Remove the `node_modules` folder and the `package-lock.json` file. Then run `npx svelte-migrate@latest sveltekit-*` with \* being the version of sveltekit you are migrating to. Migrate all possible files. Then run `npm install` to install the new dependencies.

### Installing the node server adapter

The node server adapter is required to run the website in production. To install the node server adapter, run `npm i -D @sveltejs/adapter-node@next`. Running `npm run build` will build the website with the node server adapter. Ensure the website builds and runs correctly before deploying to production.

## SSR and CSR
Server side rendering is used to pre-render the website for faster load times. This is done by running `npm run build` and then `npm run preview` to preview the website. This will build the website and run it on a local server. The website is pre-rendered and minified by svelte, and the server side adapter is used to serve the website. This is the same process used to build the website for production.

Client side rendering is used for dynamic content and interactivity. Each page can be either prerendered and or client side rendered. This is with setting `csr: true` and `prerender: true` in the +page.ts file in the route. In general, if a page has dynamic/complex content like a form it should not be prerendered. If a page is static and does not change, it should be prerendered. If a page has a mix of static and dynamic content, it should be prerendered and then the dynamic content should be loaded client side.

All pages should have client side rendering, and js hydration by proxy, because the header is rendered on the client side. Otherwise, the header will not render correctly.