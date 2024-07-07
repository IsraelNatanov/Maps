FROM node:21.4.0-alpine


WORKDIR /app

COPY package.json .

RUN npm install

COPY . .


RUN npm install

EXPOSE 5000

CMD [ "npm", "run", "dev"]