# Use uma imagem base do Ubuntu
FROM ubuntu:latest

# Defina o mantenedor da imagem (opcional)
LABEL maintainer="gabriel.silva27@estudante.ufla.br"

# Atualize o sistema e instale Python 3, pip e curl
RUN apt-get update && \
    apt-get install -y python3 python3-schedule python3-requests curl && \
    apt-get clean

# Crie o diretório /webscraper
RUN mkdir /webscraper

# Copie todos os arquivos da pasta atual para /webscraper no contêiner
COPY . /webscraper

# Defina o diretório de trabalho
WORKDIR /webscraper

# Execute o script Python usando o ambiente virtual
CMD ["python3", "webscraper.py"]
