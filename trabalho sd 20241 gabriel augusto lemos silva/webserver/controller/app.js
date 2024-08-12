import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import fs from 'fs';
const app = express();
import D3Node  from "d3-node";
import * as d3 from 'd3';

// Crie uma instância do D3Node
const d3n = new D3Node({
    svgStyles: `
        .line { stroke-width: 2; fill: none; }
        .line-path { stroke: black; }
    `
});

import nodemailer from "nodemailer";
const transporter = nodemailer.createTransport({
    service: 'gmail', // Substitua pelo seu serviço de e-mail
    auth: {
        user: 'seu@email.com', //substitua pelo seu email
        pass: 'suasenha '       //substitua pela sua senha
    }
});
const moedas = ["dolar", "euro", "bitcoin"];
const casos = ["menor", "maior"];

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

app.get("/", (req, res)=>{
    res.sendFile("/view/index.html", {root: ".."});
});

app.get("/index.html", (req, res)=>{
    res.sendFile("/view/index.html", {root: ".."});
});

app.get("/notify.html",(req, res)=>{
    res.sendFile("/view/notify.html", {root:".."});
});

//funcao que salva o valor e o email da pessoa que quer ser notificada
//exemplo salvar em dolar menor a linha "100\texemplo@exemplo.com"
function salvaEmArquivo(moeda, caso, email, valor){
    const filePath="../model/"+moeda+"_"+caso+".txt";
    const novaLinha = valor+"\t"+email+"\n";
    if(fs.existsSync(filePath)){
        console.log("Arquivo "+filePath+ "de persistencia existe");
        const conteudoAntigo = fs.readFileSync(filePath);
        const novoConteudo = conteudoAntigo+novaLinha;
        fs.writeFileSync(filePath, novoConteudo, 'utf-8');
    }else{
        console.log("Arquivo "+filePath+ "de persistencia nao existe");
        fs.writeFileSync(filePath, novaLinha, 'utf-8');
    }
}

//funcao que processsa o formulario, se o email nao for nulo ou vazio, salva os valores e o email nos arquivos de persistencia
//no final retorna true se salvou em algum arquivo, ou falso se nao salvou em nenhum
//o retorno é utilizado para saber se o processo ocorreu da maneira correta
function processaFormulario(formulario){
    console.log(formulario);
    var sentinela = false;
    if(formulario.email!= null || formulario.email!=""){
        
        if(!isNaN(formulario.dolar_valor_menor )&& formulario.dolar_valor_menor!=""){
            salvaEmArquivo("dolar","menor", formulario.email, formulario.dolar_valor_menor);
            sentinela = true;
        }
        if(!isNaN(formulario.dolar_valor_maior )&& formulario.dolar_valor_maior!=""){
            salvaEmArquivo("dolar","maior", formulario.email, formulario.dolar_valor_maior);
            sentinela = true;
        }
        if(!isNaN(formulario.euro_valor_menor )&& formulario.euro_valor_menor!=""){
            salvaEmArquivo("euro","menor", formulario.email, formulario.euro_valor_menor);
            sentinela = true;
        }
        if(!isNaN(formulario.euro_valor_maior )&& formulario.euro_valor_maior!=""){
            salvaEmArquivo("euro","maior", formulario.email, formulario.euro_valor_maior);
            sentinela = true;
        }
        if(!isNaN(formulario.bitcoin_valor_menor )&& formulario.bitcoin_valor_menor!=""){
            salvaEmArquivo("bitcoin","menor", formulario.email, formulario.bitcoin_valor_menor);
            sentinela = true;
        }
        if(!isNaN(formulario.bitcoin_valor_maior) && formulario.bitcoin_valor_maior!=""){
            salvaEmArquivo("bitcoin","maior", formulario.email, formulario.bitcoin_valor_maior);
            sentinela = true;
        }
    }
    return sentinela;
}

//post do formulario
app.post("/notify.html", async (req, res) =>{
    console.log(req.body);
    if(processaFormulario(req.body)){ //processa o formulario e da a resposta de acordo com seu retorno
        res.sendFile("/view/success.html", {root: ".."});
    }else{
        res.sendFile("/view/failed.html", {root: ".."});
    }
});


//funcao que guarda o ultimo valor postado pelo webscrapper pra moeda dolar
function atualizaDolarSeries(ultimadata, ultimovalor){
    const filePath = "../model/dolar_series.txt"
    const arquivoExiste = fs.existsSync(filePath);
    if(arquivoExiste){
        try{
            const data =fs.readFileSync(filePath, 'utf8');  //le o conteudo anterior do arquivo
            // Adicionar o novo conteúdo com uma nova linha
            const novalinha =ultimovalor + "\t" + ultimadata + "\n";  //adiciona nova linha
            const updatedContent = data + novalinha;
            
            // Escrever o conteúdo atualizado de volta no arquivo
            fs.writeFileSync(filePath, updatedContent, 'utf8'); //escreve o novo arquivo
            console.log('Conteúdo adicionado na última linha do arquivo.');
        }catch(err){
            console.log("Erro ao atualizar o ultimo scrap");
            console.log(err);
        }
    }else{
        const updatedContent = ultimovalor + "\t" + ultimadata + "\n";
        try{
            fs.writeFileSync(filePath, updatedContent, 'utf8');
        }catch(err){
            console.log("Erro ao atualizar o primeiro scrap");
        }
    }
}

//funcao que guarda o ultimo valor postado pelo webscrapper pra moeda Euro, mesma logica do processo do dolar

function atualizaEuroSeries(ultimadata, ultimovalor){

    const filePath="../model/euro_series.txt";
    const arquivoExiste = fs.existsSync(filePath);
    if(arquivoExiste){
        try{
            const data =fs.readFileSync(filePath, 'utf8');
            // Adicionar o novo conteúdo com uma nova linha
            const novalinha =ultimovalor + "\t" + ultimadata + "\n";
            const updatedContent = data + novalinha;
            
            // Escrever o conteúdo atualizado de volta no arquivo
            fs.writeFileSync(filePath, updatedContent, 'utf8');
            console.log('Conteúdo adicionado na última linha do arquivo.');
        }catch(err){
            console.log("Erro ao atualizar o ultimo scrap");
            console.log(err);
        }
    }else{
        const updatedContent = ultimovalor + "\t" + ultimadata + "\n";
        try{
            fs.writeFileSync(filePath, updatedContent, 'utf8');
        }catch(err){
            console.log("Erro ao atualizar o primeiro scrap");
        }
    }
}
//funcao que guarda o ultimo valor postado pelo webscrapper pra moeda Bitcoin, mesma logica do processo do dolar
function atualizaBitcoinSeries(ultimadata, ultimovalor){
    const filePath="../model/bitcoin_series.txt";
    const arquivoExiste = fs.existsSync(filePath);
    if(arquivoExiste){
        try{
            const data =fs.readFileSync(filePath, 'utf8');
            // Adicionar o novo conteúdo com uma nova linha
            const novalinha =ultimovalor + "\t" + ultimadata + "\n";
            const updatedContent = data + novalinha;
            
            // Escrever o conteúdo atualizado de volta no arquivo
            fs.writeFileSync(filePath, updatedContent, 'utf8');
            console.log('Conteúdo adicionado na última linha do arquivo.');
        }catch(err){
            console.log("Erro ao atualizar o ultimo scrap");
            console.log(err);
        }
    }else{
        const updatedContent = ultimovalor + "\t" + ultimadata + "\n";
        try{
            fs.writeFileSync(filePath, updatedContent, 'utf8');
        }catch(err){
            console.log("Erro ao atualizar o primeiro scrap");
        }
    }
}

function salvaUltimoScrap( corpo){
    atualizaDolarSeries(corpo.data, corpo.dolar);
    atualizaEuroSeries(corpo.data, corpo.euro);
    atualizaBitcoinSeries(corpo.data, corpo.bitcoin);
}

//funcao que envia o email depois do scrap, usando o nodemailer
function sendMail(moeda, caso, email, limiar) {
    const nome = email.split("@")[0];
    const mailOptions = {
        from: 'gabriel11475@gmail.com',
        to: email,
        subject: `Alerta de valor da moeda ${moeda}`,
        text: `Olá, ${nome}, a moeda ${moeda} está com um valor ${caso} que ${limiar}. Não perca essa oportunidade.`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log('Erro ao enviar e-mail:', error);
        }
        console.log('E-mail enviado:', info.response);
    });
}
//funcao chamada depois do post feito pelo scrapper, percorre o arquivo da moeda para o caso menor ou maior e se as condicoes forem atendidas
//envia o email
function enviaEmail(corpo) {
    const baseDir = path.resolve("../model");
    for (const moeda of moedas) {
        const valor = parseFloat(corpo[moeda]);

        console.log(`moeda: ${moeda}`);
        console.log(`ultimo valor: ${valor}`);

        for (const caso of casos) {
            const filePath = path.join(baseDir, `/${moeda}_${caso}.txt`);
            if(fs.existsSync(filePath)){
                try {
                    console.log(`arquivo ${filePath} existe`);
                    const data =  fs.readFileSync(filePath, 'utf8');
                    console.log("leu o arquivo");
                    console.log(`data: ${data}`);
                    const vetor = data.split("\n");
                    let novoConteudo = "";
                    vetor.forEach(linha => {
                        //console.log("linha");
                        //console.log(linha);
                        const vetorlinha = linha.split(/\s+/);
                        //console.log(`email: ${vetorlinha[1]}`);
                        //console.log(`limiar: ${vetorlinha[0]}`);
                        //se a condicao for atendida, envia o email
                        if ((caso == "menor" && valor <= parseFloat(vetorlinha[0])) || (caso == "maior" && valor > parseFloat(vetorlinha[0]))) {
                            sendMail(moeda, caso, vetorlinha[1], vetorlinha[0]);
                        } else { //se nao for atendida, escreve a linha na persistencia
                            if(linha!=""){
                                novoConteudo += linha + "\n";
                            }
                        } //no final o arquivo tera somente as linhas que nao forem atendidas pelas condicoes
                    });
                    fs.writeFileSync(filePath, novoConteudo, 'utf8');   //salva as linhas nao atendidas
                    console.log(`${filePath} atualizado`);
                } catch (err) {
                    if (err.code === 'ENOENT') {
                        console.log(`Arquivo ${filePath} para mandar email não existe`);
                    } else {
                        console.error(`Erro ao acessar ou ler o arquivo: ${err}`);
                    }
                }
            }
        }
    }
}

async function geraGrafico(dataatual){
    for (const moeda of moedas){
        var vetorX = [];
        var vetorY= [];
        const filePath= '../model/'+moeda+'_series.txt';
        if(fs.existsSync(filePath)){
            try {
                console.log(`gerando grafico, arquivo ${filePath} existe`);
                const data =  fs.readFileSync(filePath, 'utf8');
                console.log('gerando grafico, leu o arquivo');
                //console.log(`data: ${data}`);
                const vetor = data.split("\n");
                let novoConteudo = "";
                vetor.forEach(linha => {
                    if(linha!=""){
                        const vetorlinha = linha.split(/\s+/);
                        vetorY.push(parseFloat(vetorlinha[0]));
                        vetorX.push(vetorlinha[2]);
                    }
                });
                console.log(vetorX);

                // Crie uma instância do D3Node
                const d3n = new D3Node({
                    svgStyles: `
                        .line { stroke-width: 2; fill: none; }
                        .line-path { stroke: black; }
                        .axis path, .axis line { fill: none; shape-rendering: crispEdges; }
                    `
                });
                
                // Configurações do gráfico
                const margin = { top: 20, right: 20, bottom: 50, left: 50 };
                const width = 800 - margin.left - margin.right;
                const height = 600 - margin.top - margin.bottom;
                
                const svg = d3n.createSVG()
                    .attr('width', 800)
                    .attr('height', 600);
                
                // Adiciona o fundo verde
                svg.append('rect')
                    .attr('width', 800)
                    .attr('height', 600)
                    .attr('fill', 'green');
                // Escalas
                const xScale = d3.scaleBand()
                    .domain(vetorX) // Domínio para as categorias
                    .range([0, width])
                    .padding(0.1);
                
                const yScale = d3.scaleLinear()
                    .domain([0, d3.max(vetorY)]) // Domínio para os valores
                    .range([height, 0]);
                
                // Função para criar a linha
                const line = d3.line()
                    .x(d => xScale(d.category) + xScale.bandwidth() / 2) // Centro da banda
                    .y(d => yScale(d.value));
                
                // Dados para a linha
                const lineData = vetorX.map((x, i) => ({ category: x, value: vetorY[i] }));
                
                // Adiciona o eixo X
                svg.append('g')
                    .attr('transform', `translate(${margin.left},${margin.top + height})`)
                    .call(d3.axisBottom(xScale))
                    .attr('class', 'axis');
                
                // Adiciona o eixo Y
                svg.append('g')
                    .attr('transform', `translate(${margin.left},${margin.top})`)
                    .call(d3.axisLeft(yScale))
                    .attr('class', 'axis');
                
                // Adiciona a linha
                svg.append('path')
                    .data([lineData])
                    .attr('class', 'line line-path')
                    .attr('d', line)
                    .attr('transform', `translate(${margin.left},${margin.top})`);
                
                // Salva o gráfico como um arquivo SVG
                fs.writeFileSync('line-chart-categorical.svg', d3n.svgString());
                console.log('Gráfico salvo como line-chart-categorical.svg');
                
                
                console.log('lineData:', lineData);
                console.log('xScale domain:', xScale.domain());
                console.log('yScale domain:', yScale.domain())

                fs.writeFileSync("../view/images/"+moeda+'_grafico.svg', d3n.svgString());
                console.log('Gráfico salvo como chart.svg');
                console.log('Gráfico de linhas de '+moeda+' com título gerado com sucesso!');
            }catch(err){
                console.log('erro ao gerar grafico');
                console.log(err);
            }
        }else{
            console.error("arquivo nao existe");
        }
    }
}

//post que o scrapper usa para enviar os dados
app.post("/receivedatafromscrapper", (req, res) =>{
    console.log(req.body);
    console.log("salvando scrapper");
    salvaUltimoScrap(req.body);
    console.log("scrap salvo, enviando emails");
    enviaEmail(req.body);
    console.log("emails enviados, gerando grafico");
    geraGrafico(req.body.data);
    res.send("post do webscrapper");
});

//gets usados pelo sistema
app.get("/styles.css", (req, res) =>{
    res.sendFile("/view/styles.css", {root: ".."});
});

app.get("/images/grafico_fundo.png", (req, res) =>{
    res.sendFile("/view/images/grafico_fundo.png", {root:".."});
});

app.get("/scripts.js", (req, res)=>{
    res.sendFile("/view/scripts.js", {root: ".."});
});

app.get("/recarregar_imagens.js", (req, res) =>{
    res.sendFile("/view/recarregar_imagens.js", {root: ".."});
});

app.get("/images/bitcoin.jpg", (req,res)=>{
    res.sendFile("/view/images/bitcoin.jpg", {root: ".."});
});

app.get("/images/nota_dolar.jpg", (req, res)=>{
    res.sendFile("/view/images/nota_dolar.jpg", {root: ".."});
});

app.get("/images/nota_euro.jpeg", (req, res)=>{
    res.sendFile("/view/images/nota_euro.jpeg", {root: ".."});
});

app.get("/images/dolar_grafico.png", async (req, res)=>{
    res.sendFile("/view/images/dolar_grafico.svg", {root: ".."});
});

app.get("/images/euro_grafico.png", async (req, res)=>{
    res.sendFile("/view/images/euro_grafico.svg", {root: ".."});
});

app.get("/images/bitcoin_grafico.png", async (req, res)=>{
    res.sendFile("/view/images/bitcoin_grafico.svg", {root: ".."});
});


const porta = 5000;
app.listen(porta, ()=>{console.log(`rodando o server na porta ${porta}`);});

//geraGrafico("123");
