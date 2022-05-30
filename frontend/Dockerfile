FROM node:17

ADD package.json /package.json

ENV NODE_PATH=/node_modules
ENV PATH=$PATH:/node_modules/.bin
RUN npm install

WORKDIR /app
ADD . /app

# hot reload
EXPOSE 35729
# web
EXPOSE 3000 

