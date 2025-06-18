FROM node:22.16.0-bookworm-slim

ADD package.json /package.json
ADD package-lock.json /package-lock.json

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
