import os
import re
import datetime
import requests
import schedule
import time

# Caminho para o script Bash
script_bash = "./script_scraper.sh"
#data_hora_atual = datetime.datetime.now().strftime("%d/%m/%Y %H:%M")
pattern = r'\b\d{1,3}(?:\.\d{3})*,\d{2}\b'
moedas = ("dolar", "euro", "bitcoin")

# Executar o script Bash
def rodaScript():
    exit_code = os.system(script_bash)
    while( exit_code!=0):
        exit_code = os.system(script_bash)
        print(os.getcwd())



#tratar dados
def tratarDados():
    valores = []
    for moeda in moedas:
        arquivo_html = moeda+"_agora.html"
        if( os.path.exists(arquivo_html)):
            with open(arquivo_html, "r", encoding="UTF-8", errors='ignore') as file:
                html_content = file.read()
                matches = re.findall(pattern, html_content)
                if matches:
                    linha = 0
                    for match in matches:
                        print(str(linha)+ " "+match)
                    valor_atual = matches[2].replace(",", ".")  #pega o valor referente à moeda em reais e substitui virgulas (formatacao br)
                    print("Valor de "+moeda+f" atual é: {valor_atual}")
                    valores.append(valor_atual) #adiciona ao vetor
                else:
                    print("Nenhum número real encontrado.")
                file.close()
            os.remove(arquivo_html)
        else:
            print(arquivo_html+" nao encontrado")
    if(valores == []):
        return None
    else:
        return valores

def enviarDados(valores):   
    if valores != None:
        data_hora_atual = datetime.datetime.now().strftime("%d/%m/%Y %H:%M")
        try:
            url = 'http://webserver:5000/receivedatafromscrapper' #endereco do webserver quando dockerizado pelo docker-compose
            data = {        #cria objeto para ser enviado ao webserver
                "data" : data_hora_atual,
                "dolar" : valores[0],
                "euro" :  valores[1],
                "bitcoin": valores[2]
            }
            print(data)
            response = requests.post(url, json=data)
            print('Status Code:', response.status_code)
            print('Response Body:', response.text)
        except Exception:
            print(Exception)
    
def scrap():        #funcao basica de scrap
    rodaScript()
    valores = tratarDados()
    enviarDados(valores)

def scrapEmXMinutos (tempo):    #funcao que executa o scrap em tempo minutos
    print("Scrapping")
    schedule.every(tempo).minutes.do(scrap)
    while True:
        # Rodar todas as tarefas agendadas
        schedule.run_pending()
        # Aguardar um segundo antes de verificar novamente
        time.sleep(1)

enviarDados([0,0,0])
scrap()
scrapEmXMinutos(2)  #configurado para realizar o scrap de 2 em 2 minutos