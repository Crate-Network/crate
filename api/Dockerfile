FROM node:16-alpine AS build

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn

COPY . ./
RUN yarn build

FROM node:16-alpine
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist .
CMD [ "node", "app.js" ]