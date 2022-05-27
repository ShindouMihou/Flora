# Flora
A simple, markdown-based blog platform written completely in Typescript, Sveltekit and Tailwind. Unlike other platforms, Flora aims to be simple and minimal but still being beautiful with the help of tools like Bionic Reading to enable superior reading speeds.

## Installation
You can setup your own instance of Flora by following the steps below:

Clone the repository:
```shell
git clone https://github.com/ShindouMihou/Flora && cd Flora
```

Configure the required configurations:
```shell
cp .env.example .env && nano .env
```

> All of the configurations are required to be configured otherwise there will be issues, please take note especially of the ones with `_SECRET` or `_SIGNATURE` since those especially need to be hidden to yourself. **Don't expose them!!!**

Install MongoDB with Docker (optional if you have one already):
```shell
docker volume create flora_db
docker run --name flora_db --restart=always -e MONGO_INITDB_ROOT_USERNAME=<SECRET DATABASE USERNAME> -e MONGO_INITDB_ROOT_PASSWORD=<SECRET DATABASE PASSWORD> -v flora_db:/data/db mongo
```

After installing MongoDB, you need to configure the MONGO_URI in `.env`:
```shell
nano .env
```

> If you used the MongoDB Docker steps above then you can use the following:
> ```java
> mongodb://<SECRET DATABASE USERNAME>:<SECRET DATABASE PASSWORD>@172.17.0.1:27017/?authSource=admin
> ```

> Remember to use the Docker machine host address: `172.17.0.1` when writing your connection address.

You can then start building the docker image for Flora and run the application:
```shell
docker build -t flora .
docker run -d -i -t -p 3000:3000 --env-file .env --name flora flora:latest
```

Flora should now be running at `https://localhost:3000` (to change the port, change the value of `-p`: `-p <machine port>:3000`).

## Creator Dashboard
You can access Flora's creator dashboard which is located on `/creator/`. You'll be redirected to the login page (`/creator/login`) if you are not logged in. After that, you can create new articles, delete, update and whatever you like. Although Flora won't host any images whatsoever which means you need to upload the images somewhere.

If you want to log-out of the creator account then you can head to `/creator/logout` which should log you out of the creator account.

## SEO
Flora supports a minimal amount of SEO which is configured on `.env` file, those SEO properties will be reflected on all pages except for the creator pages and also the articles themselves (which have their own SEO based on the content). 

Articles uses the following SEO properties:
- `title`: The article title itself that was set for the article.
- `image`: The article image that was set for the article.
- `content`: The first 165-characters content written.
- `article:author`: The value configured in `VITE_DISPLAY_NAME` in `.env` file.

## State of Flora
Flora is far from reaching stable release and at the moment is on development versions with the following features and functionalities implemented or missing:
- [x] Home (`/`) and Post (`/posts/:id`) pages.
- [x] HTTP API for getting posts and creating posts.
- [x] HTTP API for creating new posts, deleting posts and updating posts.
- [x] Bionic reading (not the best implementation but not the worst).
- [ ] Transpiler for .md files to .svelte files to enable static generated sites.
- [x] Editor (`/editor/:id`) and Creator Dashboard (`/creator/`)

## Show Flora some love!
If you like and is using Flora then feel free to show the project some love by adding a star to the repository or by enabling `VITE_FLORA_BANNER` in your configuration which will show the `made with FLORA` banner at the top of your page (will not be shown again if the user opts to hide it).