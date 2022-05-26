# Flora
An simple, markdown-based blog platform written completely in Typescript, Sveltekit and Tailwind. Flora utilizes multiple technologies such as MongoDB and its sister application [Silva](https://github.com/ShindouMihou/Silva) for storing the posts and also for managing the images. Unlike other platforms, Flora aims to be simple and minimal but still being beautiful with the help of tools like Bionic Reading to enable superior reading speeds.

## State of Flora
Flora is far from reaching stable release and at the moment is on development versions with the following features and functionalities implemented or missing:
- [x] Home (`/`) and Post (`/posts/:id`) pages.
- [x] HTTP API for getting posts and creating posts.
- [x] HTTP API for creating new posts, deleting posts and updating posts.
- [x] HTTP API for media flow with [Silva](https://github.com/ShindouMihou/Silva)
- [ ] Editor (`/editor/:id`) and Creator Dashboard (`/creator/`)