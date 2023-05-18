FROM node:16.14-alpine
WORKDIR /app/micro_admin_backend
COPY package* ./
RUN npm install
COPY . .
ENTRYPOINT [ "npm", "run" ]