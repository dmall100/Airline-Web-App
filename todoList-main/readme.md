## todoList -- an simple app built using node.js

todoList is a simple app built using Javascript with Node.js.<br/>
Requirements:
* node.js installed
* text editor, visual studio code is suggested
* need to connect UH database
* bootstrap is used in building the interface

### The server:
the server folder incldues:
* index.js: to communite with client;
* db.js: to connect to the web server.
* package.json: the project information and dependencies 

Run command: "**npm install**" inside the server folder using terminal to install all the dependencies with node.js installed on your computer. <br/>
Run command: "**node index.js**" to start the server

### The client
the client folder includes:
* index.html: the interface
* style.css: the style used in index.html
* main.js: Javascript codes to interact with interface.

The client part uses **Fetch** API to communite with server. **Bootstrap** library is used in building the interface. <br/>
Suggest using **Live Server** in vscode to run the front end.