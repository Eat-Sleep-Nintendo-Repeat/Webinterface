FROM node:16.6.1

WORKDIR /opt/web
COPY package.json package-lock.json ./
RUN npm install

ENV PATH="./node_modules/.bin:$PATH"

COPY . ./
RUN npm run build
RUN npm install -g serve

#TAEFIK CONFIG
LABEL traefik.enable="true" \
      traefik.http.routers.esnr-ui.entrypoints="websecure" \
      traefik.http.routers.esnr-ui.rule="Host(`ui.eat-sleep-nintendo-repeat.eu`)" \
      traefik.port="80" \
      traefik.http.routers.esnr-ui.tls.certresolver="letsencrypt"

EXPOSE 80

CMD serve -s build -l 80