# Use a imagem oficial do Node.js
FROM node:latest

LABEL maintainer="gabriel.silva27@estudante.ufla.br"

# Crie o diretório /webserver
RUN mkdir /webserver

# Defina o diretório de trabalho
WORKDIR /webserver

# Copie todos os arquivos da pasta atual para /webserver no contêiner
COPY . /webserver

#instala dependenncias do canvas
RUN apt-get update && \
    apt-get install -y \
    build-essential \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
    libgd-dev \
    libpng-dev \
    fonts-liberation \
    fontconfig \
    fonts-dejavu 
    
#muda pra pasta do controller
WORKDIR /webserver/controller

# Instale pacotes adicionais
#RUN npm install -g express body-parser nodemailer node-gyp chartjs-node-canvas

RUN npm install

# Exponha a porta que a aplicação irá escutar
EXPOSE 5000

# Comando para iniciar a aplicação
CMD ["node", "app.js"]
