FROM node:14-alpine

WORKDIR /app
ADD package.json yarn.lock ./
RUN yarn install

ADD . ./
RUN yarn build

EXPOSE 3000

CMD [ "yarn", "start" ]
