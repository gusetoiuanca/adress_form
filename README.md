**Start the services**

Start backend:
    1. `cd backend-service && docker-compose up`
Start front-end:
    2. `cd - && cd frontent && yarn start`

**Environment**

I have used **Docker** to ensure that we will run the same software versions.

For the backend part I have chosen **mongo:3.2.6** , **redis:5.0.2** and **node:8**.

When you will run `docker-compose up` i have ensured the following actions via `docker-compose.yaml`

* the nodejs server, the database and redis caching system will run in their own container
* links between those 3 systems will be created 
* environment variables for mongo host & port and redis host & port will be created in order to be used in the app
* the database will be populated with the data from backend-service/mongo-seed
