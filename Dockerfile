FROM nginx:1.17.10-alpine
RUN apk add nano && apk add curl
WORKDIR /usr/share/nginx/html
COPY ./index.html ./
COPY *.js ./
COPY *.css ./
COPY *.ico ./
RUN rm -rf /etc/nginx/conf.d/default.conf
COPY ./nginx.conf /etc/nginx/conf.d
EXPOSE 30201




# docker build -t frontendvm . && docker tag frontendvm localhost:5000/frontendvm && docker push localhost:5000/frontendvm