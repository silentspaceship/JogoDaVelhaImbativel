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
            }, 5);
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

    setTimeout(() => {
        declararVencedor(vitoria.jogador == usuario ? "Você venceu... Só pode ser um erro na Matrix. 🤔" : "Você perdeu, quem sabe na próxima... 🥱")
    }, 800);
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
    return minimax(tabela, computador).index;
}

function empate() {
    if (quadradosVazios().length == 0) {
        for (let i = 0; i < caixas.length; i++) {
            caixas[i].style.backgroundColor = "royalblue";
            caixas[i].removeEventListener('click', proximoTurno, false);  
        }

        setTimeout(() => {
            declararVencedor("Empate... Não significa que o computador tenha perdido. 🤖");
        }, 800);

        return true;
    }
    return false;
}

function minimax(novaTabela, jogador) {
    var espacosDisponiveis = quadradosVazios(novaTabela);

    if (verificaVitoria(novaTabela, usuario)) {
        return {score: -10};
    } else if (verificaVitoria(novaTabela, computador)) {
        return {score: 10};
    } else if (espacosDisponiveis.length === 0) {
        return {score: 0};
    }

    var movimentos = [];

    for (let i = 0; i < espacosDisponiveis.length; i++) {
        var movimento = {};
        movimento.index = novaTabela[espacosDisponiveis[i]];
        novaTabela[espacosDisponiveis[i]] = jogador;

        if (jogador == computador) {
            var resultado = minimax(novaTabela, usuario);
            movimento.score = resultado.score;
        } else {
            var resultado = minimax(novaTabela, computador);
            movimento.score = resultado.score;
        }

        novaTabela[espacosDisponiveis[i]] = movimento.index;

        movimentos.push(movimento);
    }

    var melhorMovimento;

    if (jogador === computador) {
        var melhorScore = -10000;

        for (let i = 0; i < movimentos.length; i++) {
            if (movimentos[i].score > melhorScore) {
                melhorScore = movimentos[i].score;
                melhorMovimento = i;
            }
        }
    } else {
        var melhorScore = 10000;

        for (let i = 0; i < movimentos.length; i++) {
            if (movimentos[i].score < melhorScore) {
                melhorScore = movimentos[i].score;
                melhorMovimento = i;
            }
        }
    }

    return movimentos[melhorMovimento];
}