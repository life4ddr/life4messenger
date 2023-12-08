FROM node:18
WORKDIR /
COPY package*.json ./
RUN npm install
COPY . .
CMD ["node","life4bot.js"] 