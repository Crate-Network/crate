FROM node:16 as build
WORKDIR /app
COPY . .
RUN yarn && yarn build

FROM nginx:1.20.2-alpine
COPY --from=build /app/dist /usr/share/nginx/html