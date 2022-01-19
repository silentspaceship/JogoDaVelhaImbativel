var tabela;
const usuario = 'X';
const computador = 'O';
const combosVitoria = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

const caixas = document.querySelectorAll('.caixa');

iniciaJogo();

function iniciaJogo() {
    document.querySelector(".background-fim-do-jogo").style.display = 'none';
    document.querySelector(".fim-do-jogo").style.display = 'none';
    tabela = Array.from(Array(9).keys());       // Cria um Array usando as chaves de outro Array (Outra opção: Array.from(012345678))

    for (let i = 0; i < caixas.length; i++) {
        caixas[i].innerText = '';
        caixas[i].style.backgroundColor = 'white';
        caixas[i].addEventListener('click', proximoTurno, false);
    }
}

function proximoTurno(quadrado) {
    if (typeof tabela[quadrado.target.id] == 'number') {
        turno(quadrado.target.id, usuario)

        if (!empate()) {
            setTimeout(() => {
                turno(melhorJogada(), computador);
            }, 50);
        }
    }
}

function turno(quadradoId, jogador) {
    tabela[quadradoId] = jogador;
    document.getElementById(quadradoId).innerText = jogador;

    let vitoria = verificaVitoria(tabela, jogador)

    if (vitoria) {
        fimDeJogo(vitoria)
    }
}

function verificaVitoria(tabuleiro, jogador) {
    // Modo Simplificado
    // let jogadas = tabuleiro.reduce((total, posicao, index) => (posicao === jogador) ? total.concat(index) : total, []);

    let jogadas = tabuleiro.reduce((total, posicao, index) => {
        if (posicao === jogador) {
            return total.concat(index);
        }

        return total;
    }, []);

    let ganhou = null;

    for (let [index, combo] of combosVitoria.entries()) {
        if (combo.every(elem => jogadas.indexOf(elem) > -1)) {
            ganhou = {index: index, jogador: jogador};
            break;
        };
    }

    return ganhou;
}

function fimDeJogo(vitoria) {
    for (let index of combosVitoria[vitoria.index]) {
        document.getElementById(index).style.backgroundColor = vitoria.jogador === usuario ? "lightgreen" : "goldenrod";
    }

    for (let i = 0; i < caixas.length; i++) {
        caixas[i].removeEventListener('click', proximoTurno, false);
    }

    declararVencedor(vitoria.jogador == usuario ? "Você venceu! Mas como? 🤔" : "Você perdeu! Quem sabe na próxima... 🥱")
}

function declararVencedor(quem) {
    document.querySelector(".background-fim-do-jogo").style.display = "block";
    document.querySelector(".fim-do-jogo").style.display = "flex";
    document.querySelector(".fim-do-jogo .texto").innerText = quem;
}

function quadradosVazios() {
    return tabela.filter(quadrado => typeof quadrado == 'number');
}

function melhorJogada() {
    return quadradosVazios()[0];
}

function empate() {
    if (quadradosVazios().length == 0) {
        for (let i = 0; i < caixas.length; i++) {
            caixas[i].style.backgroundColor = "lightgreen";
            caixas[i].removeEventListener('click', proximoTurno, false);  
        }

        declararVencedor("Empate!");
        return true;
    }
    return false;
}