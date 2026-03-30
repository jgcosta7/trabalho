let listaDeTarefas = [];

// pegando os elementos do html e usando querySelector 
const form = document.querySelector('#formulario');
const inputBusca = document.querySelector('#campo-busca');
const divTarefas = document.querySelector('#box-tarefas');

// carrega do localstorage quando abre a pagina
function iniciar() {
    let dados = localStorage.getItem('minhas_tarefas');
    if (dados != null) {
        listaDeTarefas = JSON.parse(dados);
    }
    mostrarNaTela();
}

// evento do formulario
form.addEventListener('submit', function(e) {
    e.preventDefault(); // nao deixa a pagina recarregar

    let titulo = document.querySelector('#campo-titulo').value;
    let desc = document.querySelector('#campo-desc').value;
    let prio = document.querySelector('#campo-prio').value;

    // validacao simples
    if (titulo == '' || desc == '' || prio == '') {
        alert('Preencha tudo!');
        return;
    }

    let nova = {
        id: Math.floor(Math.random() * 1000000), // gerando id aleatorio
        tit: titulo,
        txt: desc,
        prioridade: prio,
        feita: false
    };

    listaDeTarefas.push(nova);
    localStorage.setItem('minhas_tarefas', JSON.stringify(listaDeTarefas));
    
    form.reset();
    mostrarNaTela();
});

// evento de busca ao digitar
inputBusca.addEventListener('keyup', function() {
    mostrarNaTela();
});

function mostrarNaTela() {
    divTarefas.innerHTML = '';
    let textoBusca = inputBusca.value.toLowerCase();

    let achouAlguma = false;

    // usando for classico 
    for (let i = 0; i < listaDeTarefas.length; i++) {
        let t = listaDeTarefas[i];
        
        // verificando se a busca bate com o titulo
        if (t.tit.toLowerCase().indexOf(textoBusca) == -1) {
            continue; 
        }
        
        achouAlguma = true;

        let card = document.createElement('div');
        card.className = 'item-tarefa';
        
        if (t.feita == true) {
            card.classList.add('finalizada');
        }

        let statusTexto = 'Pendente';
        if (t.feita) {
            statusTexto = 'Concluída';
        }

        card.innerHTML = `
            <h3>${t.tit}</h3>
            <p><strong>Detalhes:</strong> ${t.txt}</p>
            <p>Prioridade: <span class="prio-${t.prioridade}">${t.prioridade}</span></p>
            <p>Status: ${statusTexto}</p>
            <div class="botoes-acao">
                <button class="btn-ok" onclick="marcarFeita(${t.id})">OK</button>
                <button class="btn-edit" onclick="editar(${t.id})">Editar</button>
                <button class="btn-del" onclick="apagar(${t.id})">Apagar</button>
            </div>
        `;
        
        divTarefas.appendChild(card);
    }

    if (achouAlguma == false) {
        divTarefas.innerHTML = '<p>Nenhuma tarefa encontrada...</p>';
    }
}

function apagar(idDaTarefa) {
    let novaLista = [];
    for (let i = 0; i < listaDeTarefas.length; i++) {
        if (listaDeTarefas[i].id != idDaTarefa) {
            novaLista.push(listaDeTarefas[i]);
        }
    }
    listaDeTarefas = novaLista;
    localStorage.setItem('minhas_tarefas', JSON.stringify(listaDeTarefas));
    mostrarNaTela();
}

function marcarFeita(idDaTarefa) {
    for (let i = 0; i < listaDeTarefas.length; i++) {
        if (listaDeTarefas[i].id == idDaTarefa) {
            listaDeTarefas[i].feita = true;
        }
    }
    localStorage.setItem('minhas_tarefas', JSON.stringify(listaDeTarefas));
    mostrarNaTela();
}

function editar(idDaTarefa) {
    for (let i = 0; i < listaDeTarefas.length; i++) {
        if (listaDeTarefas[i].id == idDaTarefa) {
            let novoTit = prompt('Novo título:', listaDeTarefas[i].tit);
            let novoTxt = prompt('Nova descrição:', listaDeTarefas[i].txt);
            
            if (novoTit != null && novoTit != '') {
                listaDeTarefas[i].tit = novoTit;
                listaDeTarefas[i].txt = novoTxt;
            }
        }
    }
    localStorage.setItem('minhas_tarefas', JSON.stringify(listaDeTarefas));
    mostrarNaTela();
}

// roda o sistema quando o arquivo termina de carregar
iniciar();