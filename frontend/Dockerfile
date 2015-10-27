FROM nginx

RUN \
    apt-get update && \
    apt-get install -y curl && \
    curl -sL https://deb.nodesource.com/setup | bash - && \
    apt-get install -y nodejs && \
    apt-get install -y git && \
    apt-get purge -y curl apt-transport-https && \
    apt-get autoremove -y && \
    apt-get clean all

RUN npm install -g bower gulp

COPY . /src

RUN \
    cd /src && \ 
    npm install && \
    bower install --allow-root && \
    gulp dist && \
    cp -r dist/* /usr/share/nginx/html/

EXPOSE 80
