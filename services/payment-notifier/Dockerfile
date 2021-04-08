ARG UBUNTU_VERSION=20.04

FROM ubuntu:${UBUNTU_VERSION} as ubuntu-nodejs
ARG NODEJS_MAJOR_VERSION=14
ENV DEBIAN_FRONTEND=nonintercative
RUN apt-get update && apt-get install curl -y &&\
  curl --proto '=https' --tlsv1.2 -sSf -L https://deb.nodesource.com/setup_${NODEJS_MAJOR_VERSION}.x | bash - &&\
  apt-get install nodejs -y

FROM ubuntu-nodejs as nodejs-builder
RUN curl --proto '=https' --tlsv1.2 -sSf -L https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - &&\
  echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list &&\
  apt-get update && apt-get install gcc g++ make gnupg2 yarn -y
RUN mkdir -p /app/packages
WORKDIR /app
COPY packages-cache packages-cache
COPY packages/common packages/common
COPY packages/payment-notifier packages/payment-notifier
COPY packages/cli packages/cli
COPY \
  .yarnrc \
  package.json \
  yarn.lock \
  tsconfig.json \
  /app/

FROM nodejs-builder as typescript-builder
RUN yarn --offline --frozen-lockfile --non-interactive &&\
   yarn build

FROM nodejs-builder as cli-production-deps
RUN yarn --offline --frozen-lockfile --non-interactive --production

FROM ubuntu-nodejs
COPY --from=typescript-builder /app/packages/common/dist /app/packages/common/dist
COPY --from=typescript-builder /app/packages/common/package.json /app/packages/common/package.json
COPY --from=typescript-builder /app/packages/cli/dist /app/packages/cli/dist
COPY --from=typescript-builder /app/packages/cli/package.json /app/packages/cli/package.json
COPY --from=typescript-builder /app/packages/payment-notifier/dist /app/packages/payment-notifier/dist
COPY --from=typescript-builder /app/packages/payment-notifier/package.json /app/packages/payment-notifier/package.json
COPY --from=cli-production-deps /app/node_modules /app/node_modules
WORKDIR /app/packages/cli/dist
ENTRYPOINT ["node", "index.js"]
