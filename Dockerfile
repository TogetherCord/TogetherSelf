FROM node:16-alpine

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm ci --production

COPY . .

EXPOSE 8080

ARG TOKEN
ENV TOKEN=$TOKEN

CMD [ "node", "index.js" ]
