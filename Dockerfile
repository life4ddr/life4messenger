# syntax=dcoker/dockerfile:1
FROM node:10
WORKDIR /
COPY package*.json ./
RUN npm install
COPY . .
CMD ["node","life4bot.js"] 