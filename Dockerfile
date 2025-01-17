FROM node:22.9.0

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN mkdir -p /app/public/images/uploads/users /app/public/images/uploads/temp && \
    chmod -R 755 /app/public/images/uploads

EXPOSE 3000

CMD ["node", "back-end/index.js"]