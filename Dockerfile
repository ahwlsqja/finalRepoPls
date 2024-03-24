#1. Node.js 설치
FROM node:current-slim
# RUN apt-get update
# RUN DEBIAN_FRONTEND=noninteractive apt-get install -y nodejs npm

#2. 소스 복사
COPY . .

#3. Node.js 패키지 설치
WORKDIR /usr/src/app
RUN npm install

#4. WEB 서버 실행 (Listen 포트 정의)
EXPOSE 3000
CMD ["nodemon app.js", "start"]
