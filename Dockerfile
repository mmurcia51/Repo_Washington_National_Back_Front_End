FROM ubuntu:23.10
MAINTAINER Ronald Frederick version: 0.1
RUN apt-get update && apt-get install -y nodejs && apt-get install -y npm && apt-get install -y redis
RUN mkdir -p /home/appdemoDav
RUN cd /home/appdemoDav
RUN npm -y init
#RUN npm install -g npm
#RUN npm install express axios redis response-time --save
ARG CACHEBUST=1
RUN npm install express --verbose
RUN npm install axios
RUN npm install redis
COPY server.js /home/appdemoDav/
RUN redis-server
RUN nodejs server.js
EXPOSE 8080
