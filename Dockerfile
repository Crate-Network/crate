FROM node:16
WORKDIR /
COPY . .
RUN yarn && yarn bootstrap