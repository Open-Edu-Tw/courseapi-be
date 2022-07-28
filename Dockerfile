FROM docker.io/library/node:16-buster

WORKDIR /src

ADD . /src

RUN yarn

ENTRYPOINT [ "yarn", "run", "server" ]
