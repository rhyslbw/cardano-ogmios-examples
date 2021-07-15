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
COPY packages/payment-notifier packages/payment-notifier
COPY \
  .yarnrc \
  package.json \
  yarn.lock \
  tsconfig.json \
  /app/

FROM nodejs-builder as ts-builder
RUN yarn --offline --frozen-lockfile --non-interactive &&\
   yarn build

FROM nodejs-builder as production-deps
RUN yarn --offline --frozen-lockfile --non-interactive --production

FROM ubuntu-nodejs as runtime
RUN curl --proto '=https' --tlsv1.2 -sSf -L https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add - &&\
  echo "deb http://apt.postgresql.org/pub/repos/apt/ `lsb_release -cs`-pgdg main" | tee  /etc/apt/sources.list.d/pgdg.list &&\
  apt-get update && apt-get install -y --no-install-recommends \
  ca-certificates

FROM runtime as payment-notifier
ENV \
  OGMIOS_HOST="cardano-node-ogmios" \
  PUSHOVER_TOKEN_FILE=/run/secrets/pushover_token \
  PUSHOVER_USER_FILE=/run/secrets/pushover_user
COPY --from=ts-builder /app/packages/payment-notifier/dist /app/packages/payment-notifier/dist
COPY --from=ts-builder /app/packages/payment-notifier/package.json /app/packages/payment-notifier/package.json
COPY --from=production-deps /app/node_modules /app/node_modules
WORKDIR /app/packages/payment-notifier/dist
EXPOSE 3000
CMD ["node", "index.js"]
