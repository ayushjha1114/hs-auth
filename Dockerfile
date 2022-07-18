FROM node:14.17.6

# Create app directory
WORKDIR /usr/src/app

# Bundle app source
COPY . .

COPY package.json /usr/src/app/

RUN npm install
#RUN npm install --global grpc --unsafe-perm

EXPOSE 3001 9201
CMD [ "npm", "run", "start" ]
