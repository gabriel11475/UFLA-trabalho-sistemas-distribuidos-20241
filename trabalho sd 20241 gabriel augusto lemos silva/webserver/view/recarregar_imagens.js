function recarregarImagens() {  //script que recarrega ass imagens da pagina web para que o grafico seja atualizado em tempo real
    const imagens = document.querySelectorAll('img');
    const timestamp = new Date().getTime();
    imagens.forEach(img => {
        const src = img.src.split('?')[0];
        img.src = `${src}?t=${timestamp}`;
    });
}
setInterval(recarregarImagens, 7000); //recarrega de 7 em 7 segundos 