FROM node AS build

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn

COPY . ./
RUN yarn build
CMD [ "node", "dist/app.js" ]