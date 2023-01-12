FROM node:19.2-slim

WORKDIR /app/

COPY package.json .
RUN npm install

COPY . .

RUN npm run build

# hot reload
EXPOSE 35729
# web
EXPOSE 3000 

# CMD ["start"]
