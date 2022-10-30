FROM node:16 AS frontendBuilder

WORKDIR /rgb

COPY assets/ .

WORKDIR /rgb/assets
RUN npm install
RUN npm run build

FROM golang:1.16.3 AS backendBuilder

WORKDIR /go/src/rgb

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -o cmd/rgb/rgb cmd/rgb/main.go

RUN CGO_ENABLED=0 GOOS=linux go build -o migrations/migrations migrations/*.go

FROM alpine:3.14

RUN addgroup -S deploy && adduser -S deploy -G deploy

ARG ROOT_DIR=/home/deploy/rgb

WORKDIR ${ROOT_DIR}

RUN chown deploy:deploy ${ROOT_DIR}

COPY --from=frontendBuilder --chown=deploy:deploy /rgb/build ./assets/build

COPY --from=backendBuilder --chown=deploy:deploy /go/src/rgb/migrations/migrations ./migrations/
COPY --from=backendBuilder --chown=deploy:deploy /go/src/rgb/cmd/rgb/rgb .

USER deploy

CMD [ "./rgb", "-env", "prod" ]