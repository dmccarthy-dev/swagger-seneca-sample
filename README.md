# swagger-seneca-sample
A sample API facade with Seneca microservices that showcase the Swagger-seneca-router module. Swagger-seneca-router is a Node.js connect/express middleware for routing REST API calls to Seneca micro-services. The idea is that you only have to work at the schema level in Swagger and the business logic level in Seneca. None of that dealing with boiler plate code! 


### Setup 


```bash

```

Install the dependencies:

``` bash
npm install
```

### Running with forever

Install forever:

```bash
sudo npm install forever -g
```

Start the processes.

```bash
forever start forever/config.json
```

### Running manually 

Start the petstore service in one process:

``` bash
node services/petstore-service.js
```

Start the API Facade on a separate process:

``` bash
node index.js
```


Navigate to swagger docs [http://localhost:8888/docs/](http://localhost:8888/docs/).