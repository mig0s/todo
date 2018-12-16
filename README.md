# todo
A simple todo app that is a minimum viable [Trello](https://trello.com/) clone created using [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components) and plain JavaScript.

## Requirements and Installation
The app is using a fake JSON API (resources/db.json), so [json-server](https://www.npmjs.com/package/json-server) is required. Also, it is recommended to use [http-server](https://www.npmjs.com/package/http-server) to avoid any issues with Chrome's [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) policy that does not allow loading the JavaScript module from the filesystem. The app can work with *json-server* alone if you are using Firefox.

Once the project is pulled, make sure you have both *http-server* and *json-server* on your system, then you may execute the following commands from the project directory to access the app on http://127.0.0.1:8080 (if you are using default settings):

    $ http-server .
    $ cd resources
    $ json-server db.json

## Available features

1. Adding, removing and editing columns
2. Adding, removing and editing cards
3. Real-time search by card title
4. Simple responsive layout

## TODO
 - Add unit tests
 - Truncate card descriptions
 - Make cards and columns unique
 - Implement drag & drop for cards
