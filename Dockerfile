FROM docker.io/library/node:16-buster

WORKDIR /src

ADD . /src

RUN corepack enable && pnpm i

EXPOSE 4000

ENTRYPOINT [ "pnpm", "run", "server" ]
