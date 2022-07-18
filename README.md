# Auth Application #
```
A backend micro-service in NodeJS and Express web framework to provide REST APIs.

```

# Application Execution

```
git clone https://github.com/ayushjha1114/hs-auth.git
npm install
npm run dev
```

# Application configuration

```
Add following variables in .env file:

DATABASE_URL="postgres://******:******@******:****/******"
PGSQL_HOST='******'
PGSQL_DATABASE_NAME='******'
PGSQL_USERNAME='******'
PGSQL_PASSWORD='******'
PGSQL_PORT='****'
AUTH_SERVICE_PORT=3001
NODE_ENV='dev'
```

# Application NPM Script

```
"start": "cd dist &&  nodemon server.js",
"prestart": "tsc && cp -r uploads dist/ && cp -r app/global dist/app/",
"clean" : "rm -rf dist",
"copy" : "cp -r uploads dist/ && cp -r app/global dist/app/"
```
