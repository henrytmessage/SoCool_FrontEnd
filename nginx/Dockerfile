FROM nginx:latest

COPY ./configs /etc/nginx/configs
RUN rm -rf /etc/nginx/conf.d
ADD ./conf.d /etc/nginx/conf.d
COPY ./configs /etc/nginx/configs