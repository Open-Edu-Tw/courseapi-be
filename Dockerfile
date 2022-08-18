FROM docker.io/library/node:16-buster

WORKDIR /src

ADD . /src

RUN corepack enable && pnpm

EXPOSE 4000

ENTRYPOINT [ "pnpm", "run", "server" ]
