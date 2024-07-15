FROM node:16.18.0 as build-stage

WORKDIR /app

COPY . .
#ARG STAGE=dev
RUN npm install --force
RUN npm run build

#RUN if [ "$STAGE" = "production" ] ; then npm run build:prod ; fi
#RUN if [ "$STAGE" = "dev" ] ; then npm run build ; fi


# Move build files to dist/spa
RUN mkdir -p /app/dist/spa && mv build/* /app/dist/spa/

FROM nginx:latest as production-stage

COPY --from=build-stage /app/dist/spa /usr/share/nginx/html
COPY ./docker/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf
