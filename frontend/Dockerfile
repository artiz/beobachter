FROM node:19.2-slim

ADD package.json /package.json

ENV NODE_PATH=/node_modules
ENV PATH=$PATH:/node_modules/.bin
RUN npm install

WORKDIR /app/
COPY . .

RUN npm run build

# hot reload
EXPOSE 35729
# web
EXPOSE 3000 

# CMD ["start"]
