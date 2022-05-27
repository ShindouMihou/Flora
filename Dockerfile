FROM node:17-alpine

WORKDIR /app
COPY . .
RUN npm ci
RUN npm run build


FROM node:17-alpine

WORKDIR /app
COPY --from=0 /app/package*.json ./
RUN npm ci --production --ignore-scripts
COPY --from=0 /app/build ./

EXPOSE 3000
CMD ["node", "./index.js"]