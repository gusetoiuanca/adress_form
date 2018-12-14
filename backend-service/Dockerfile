FROM node:8
WORKDIR /usr/src/app
COPY app/package*.json ./
RUN npm install
COPY app .
EXPOSE 8080
CMD ["npm", "start"]