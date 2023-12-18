FROM ubuntu:23.10
MAINTAINER Ronald Frederick version: 0.1
RUN apt-get update && apt-get install -y nodejs && apt-get install -y npm && apt-get install -y redis
RUN mkdir -p /home/appdemoDav
RUN cd /home/appdemoDav
RUN npm -y init && npm install express axios redis --save
COPY server.js /home/appdemoDav/
RUN redis-server
RUN nodejs server.js
EXPOSE 8080
