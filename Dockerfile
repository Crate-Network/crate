FROM node:16
WORKDIR /
COPY . .
RUN lerna bootstrap