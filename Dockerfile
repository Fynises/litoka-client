FROM node:18-alpine3.17
COPY . .
RUN npm run build
ENTRYPOINT [ "npm", "run", "start" ]
