FROM node:16.14-alpine
WORKDIR /app/micro_category
COPY package* ./
RUN npm install
COPY . .
ENTRYPOINT [ "npm", "run" ]