FROM docker.io/library/node:16-buster

WORKDIR /src

ADD . /src

RUN yarn

EXPOSE 4000

ENTRYPOINT [ "yarn", "run", "server" ]
