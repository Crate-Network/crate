FROM ghcr.io/crate-network/base:latest as build
WORKDIR /web

ARG VITE_FIREBASE_API_KEY
ARG VITE_FIREBASE_AUTH_DOMAIN
ARG VITE_FIREBASE_PROJECT_ID
ARG VITE_FIREBASE_STORAGE_BUCKET
ARG VITE_FIREBASE_MESSAGING_SENDER_ID
ARG VITE_FIREBASE_APP_ID
ARG VITE_FIREBASE_MEASUREMENT_ID

RUN yarn && yarn build

FROM nginx:1.20.2-alpine
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /web/dist /etc/nginx/html/