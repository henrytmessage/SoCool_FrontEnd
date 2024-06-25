FROM node:18-alpine

# RUN apk add --no-cache python3 make g++ 


WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --force

COPY ./ ./

RUN npm run build

CMD ["node", "dist/main"]