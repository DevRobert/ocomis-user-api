FROM node:9.1.0-alpine

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

# Temporarily install dependencies for compilation of bcrypt
RUN apk --no-cache add --virtual builds-deps build-base python && npm install --build-from-source=bcrypt && apk del builds-deps

# Copy app files, npm_modules folder is ignored as specified in docker ignore file
COPY . .

EXPOSE 3002

CMD [ "npm", "start" ]
