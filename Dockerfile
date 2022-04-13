FROM node AS build

WORKDIR /app/
COPY . .
RUN npm install && npm run build

FROM node

WORKDIR /app/
COPY --from=build dist .
CMD [ "node", "app.js" ]