FROM node:14.16-alpine3.13

ARG GH_TOKEN
ENV GH_TOKEN=$GH_TOKEN

ENV DOCKERIZE_VERSION v0.6.1

RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
  && tar -C /usr/local/bin -xzvf dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
  && rm dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz

WORKDIR /app

COPY package*.json ./
RUN npm i

COPY . .

EXPOSE 8080

ENTRYPOINT ["sh", "scripts/build_run_app.sh"]