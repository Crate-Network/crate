FROM node:16-alpine AS build

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn

COPY . ./
RUN yarn build

FROM node:16-alpine
WORKDIR /app

ARG INFURA_PROJECT_ID
ARG INFURA_PROJECT_SECRET
ARG GOOGLE_APPLICATION_CREDENTIALS="./firebase.json"
ARG PORT=80

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist .
CMD [ "node", "app.js" ]