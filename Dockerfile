FROM node:16.20.2-bullseye

RUN apt-get update && apt-get install python make gcc g++ -y

COPY . /app

WORKDIR /app

RUN chmod +x ./start.sh

RUN npm install

RUN npm run build

ENV PORT 8000

EXPOSE 8000

CMD ["/bin/bash", "./start.sh"]

