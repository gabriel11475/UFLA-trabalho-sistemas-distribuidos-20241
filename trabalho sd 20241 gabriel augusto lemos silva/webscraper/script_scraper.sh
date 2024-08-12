#!/bin/bash

# Define User-Agent para simular um navegador web
USER_AGENT="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"

# Baixa a página da cotação do dólar
curl -L -v -A "$USER_AGENT" -o dolar_agora.html "https://www.google.com/search?q=cotacao+dolar+em+reais"

# Baixa a página da cotação do euro
curl -L -v -A "$USER_AGENT" -o euro_agora.html "https://www.google.com/search?q=cotacao+euro+em+reais"

# Baixa a página da cotação do bitcoin
curl -L -v -A "$USER_AGENT" -o bitcoin_agora.html "https://www.google.com/search?q=cotacao+bitcoin+em+reais"
