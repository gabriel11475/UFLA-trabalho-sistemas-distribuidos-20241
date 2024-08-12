function validateForm() {
    // Seleciona todos os inputs do tipo texto
    const inputs = document.querySelectorAll('input[type="text"]');
    let validEmail = true;
    let validNumber = true;
    // Função para verificar se o e-mail é válido
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Verifica cada input para ver se é um número válido ou e-mail válido
    inputs.forEach(input => {
        if (input.name === 'email') {
            if (!validateEmail(input.value)) {
                validEmail = false;
                input.style.borderColor = 'red'; // Altera a borda para vermelho se o e-mail não for válido
            } else {
                input.style.borderColor = ''; // Restaura a borda se o e-mail for válido
            }
        } else {
            if (input.value !== "" && !/^\d*\.?\d+$/.test(input.value)) {
                validNumber = false;
                input.style.borderColor = 'red'; // Altera a borda para vermelho se não for válido
            } else {
                input.style.borderColor = ''; // Restaura a borda se for válido
            }
        }
    });

    // Mostra uma mensagem de alerta se houver entradas inválidas
    let segundoPrompt = true;
    if (!validEmail) {
        alert('Por favor, insira um e-mail válido.');
        segundoPrompt = false;
    }
    if (!validNumber && segundoPrompt){
        alert('Por favor insira somente numeros validos.');
    }

    return valid; // Retorna false se houver entradas inválidas para impedir o envio do formulário
}
