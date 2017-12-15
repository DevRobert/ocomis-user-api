FROM node:9.1.0-alpine

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm install

# Copy app files, npm_modules folder is ignored as specified in docker ignore file
COPY . .

EXPOSE 3002

CMD [ "npm", "start" ]
