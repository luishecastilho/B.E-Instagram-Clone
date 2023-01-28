FROM node:lts-alpine

RUN mkdir -p /home/apps/instagram-clone

WORKDIR /home/apps/instagram-clone

COPY package*.json ./

RUN apk add --no-cache git

COPY . /home/apps/instagram-clone/

RUN chown -R node:node /home/apps

RUN npm ci

RUN npm install

RUN npm install --global @adonisjs/cli

RUN npm install pg

USER node

ENTRYPOINT ["npm", "start"]
