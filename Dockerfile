FROM node:16-alpine

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm ci --production

COPY . .

EXPOSE 8080

ARG TOKEN
ENV TOKEN=$TOKEN

ARG DISCORD_ID
ENV DISCORD_ID=$DISCORD_ID

CMD [ "node", "index.js" ]


