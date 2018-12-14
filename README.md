**Start the services**

Start backend:
    1. `cd backend-service && docker-compose build && docker-compose up`
    2. `npm test for testing`
Start front-end:
    2. `cd frontend && yarn install && yarn start`

**Environment**

I have used **Docker** to ensure that we will run the same software versions.

For the backend part I have chosen **mongo:3.2.6** and **node:8**.

When you will run `docker-compose up` i have ensured the following actions via `docker-compose.yaml`

* the nodejs server and the database will run in their own container
* links between those 2 systems will be created 
* environment variables for mongo host & port and redis host & port will be created in order to be used in the app
* the database will be populated with the data from backend-service/mongo-seed


For production the solution should be improved with
* Code coverage
* Add some throttling mechanism on the backend


Frontend
I've used 
    * react, this is at the moment the framework I am most comfortable with. 
    * boostrap to make that the style will be decent on most of the browsers.
    * webpack to ensure compatibility with most of the browsers.

I've used ES6 syntax, I prefer to use async & await instead of chaining Promises.
I prefer small functions that perform a single task, this way the code will be more testable.


Backend
The solution is a simple express server that reads data from the mongo database.
For now simply a database should be enough, because I am caching the data in the front-end.
If the app would be more read-intensive I would use a caching layer on the server side also.


In terms of tasks and time I've splited this task into:
-> deciding what technologies should I use and spliting this into tasks. took me around 1h
-> creating the environment with docker. Took me like 2h
-> creating the backend. Took me 2h
-> creating the fronted. Took me like 4h
-> adding webpack. Took me around 2h
-> adding a few tests with jest, only to show how I would test the app. Took me around 2h and didn't finish them, I suppose that I would need a full day to finish unit testing
