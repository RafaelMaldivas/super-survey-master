$(document).ready(function(){
    i = 1;
    TEMPLATES = {
        radio: `
            <div class="row mt-4">
                <div class="col-1 d-flex">
                    <input class="form-check-input ml-1 align-self-center" type="radio" disabled>
                </div>
                <div class="col-11 d-flex">
                    <input class="form-control ml-auto mr-1 w-100  align-self-center" type="text" name="alternativa">
                </div>
            </div>`,
        checkbox: `
            <div class="row mt-4">
                <div class="col-1 d-flex">
                    <input class="form-check-input ml-1 align-self-center" type="checkbox" disabled>
                </div>
                <div class="col-11 d-flex">
                    <input class="form-control ml-auto mr-1 w-100  align-self-center" type="text" name="alternativa">
                </div>
            </div>`,
        input: `
            <div class="row mt-4">
                <div class="col-12 d-flex">
                    <input class="form-control ml-auto mr-1 w-100  align-self-center disabled" type="text" disabled name="alternativa">
                </div>
            </div>`,
        textarea: `
            <div class="row mt-4">
                <div class="col-12 d-flex">
                    <textarea class="form-control disabled"  rows="3" disabled name="alternativa"></textarea>
                </div>
            </div>`       
    };

    $('.non-submit').on('submit', function(event) {
        event.preventDefault()
    });

    $('#btn-adicionar-perguntas').click(function(){
        var card = `
                    <div class="row mt-4 cartao-pergunta">
                        <div class="col-12">
                            <div class="card">
                                <div class="card-header">
                                    <form class="form-inline non-submit">
                                    <h3 class="d-inline titulo-pergunta">Pergunta ${i} </h5>
                                    <button class="btn btn-light ml-auto" title="deletar" type="button" onclick="apagarFormulario(this)">
                                        <i class="fa fa-trash fa-lg" aria-hidden="true"></i>
                                    </button>
                                    </form>
                                </div>
                                <div class="card-body">
                                    <div class="row">
                                        <div class="col-6">
                                            <input class="form-control d-inline" type="text" placeholder="Digite o texto da pergunta" name="enunciado">
                                        </div>
                                        <div class="col-6">
                                            <select class="custom-select selectAlternativas" onchange="refreshAlternativas(this)" name="tipo-pergunta">
                                                <option value="escolha_multipla" selected>Múltipla Escolha</option>
                                                <option value="caixa_selecao">Caixa de seleção</option>
                                                <option value="resposta_curta">Resposta Curta</option>
                                                <option value="resposta_longa">Parágrafo</option>
                                            </select>
                                        </div>
                                    </div>
                                    <hr>
                                    <div class="alternativas">
                                        

                                    </div>
                                    <button class="btn btn-light btnAdicionarAlternativa" onclick="adicionarAlternativa(this)"><i class="fa fa-check text-success" aria-hidden="true"></i></button>
                                </div>
                            </div>
                        </div>
                    </div>`;
        
        $('#perguntas').append(card).last();
        $('.cartao-pergunta:last').hide().fadeIn(300)
        .find('.selectAlternativas').trigger('change');
        i++;
    });

    $("#btn-enviar-formulario").on('click', function() {
        capturaDados();
    });
});

function refreshPergunta(){
    i = 1;
    $('.titulo-pergunta').each(function(elemento){
        $(this).text(`Pergunta ${i}`);
        i++;
    });
}


function apagarFormulario(element){
    $(element).closest('.cartao-pergunta').remove();
    refreshPergunta();
};

function limparAlternativa(elemento) {
    elemento.empty()
}

function appendAlternativa (elemento, limpar=false) {
    let alternativa;
    elemento = $(elemento)
    if (elemento.val() === 'escolha_multipla') {
        alternativa = TEMPLATES.radio;
    } else if (elemento.val() === 'caixa_selecao') {
        alternativa = TEMPLATES.checkbox;
    } else if (elemento.val() === 'resposta_curta') {
        alternativa = TEMPLATES.input;
    } else if (elemento.val() === 'resposta_longa') {
        alternativa = TEMPLATES.textarea;
    }
    let elemAlternativa = $(elemento).closest('.cartao-pergunta').find('.alternativas');
    if (limpar) {
        limparAlternativa(elemAlternativa);
    }
    elemAlternativa.append(alternativa);
}

function refreshAlternativas(elemento) {
    let opcao = $(elemento).val();
    let botao = $(elemento).closest('.cartao-pergunta').find('.btnAdicionarAlternativa');
    if (opcao === 'resposta_longa' || opcao === 'resposta_curta') {
        botao.hide();
    } else {
        botao.show();
    }
    appendAlternativa(elemento, true);
}

function adicionarAlternativa(elemento) {
    let select = $(elemento).closest('.cartao-pergunta').find('.selectAlternativas');
    appendAlternativa(select);
}

function capturaDados() {
    let aceitando_resposta = $("#select-aceitando").val();
    let periodo = $("#input-periodo").val();
    let periodo_tipo = $("#select-periodo").val();
    let titulo = $("#input-titulo").val();
    let descricao = $("#text-descricao").val();



    //Perguntas (conteúdo dinâmico)
    let lista_perguntas = [];
    $('.cartao-pergunta').each(function() {
        let alternativas = [];
        $(this).find('[name=alternativa]').each(function() {
            alternativas.push($(this).val());
        });
        let pergunta = {
            enunciado: $(this).find('[name=enunciado]').val(),
            tipoPergunta: $(this).find('[name=tipo-pergunta]').val(),
            alternativas: alternativas,
        };
        lista_perguntas.push(pergunta);
    });
    let formulario = {
        aceitando_resposta,
        periodo,
        periodo_tipo,
        titulo,
        descricao,
        lista_perguntas
    }
    
    if (!validarDados(formulario)){
        swal("Dados Inválidos", {
            icon: "error",
            button: "ok",
          });
        return;
    }
    const csrftoken = getCookie('csrftoken');
    // headers: {'X-CSRFToken': csrftoken}

    $.ajax({
        url: '/formulario/criacao/formulario',
        type: "POST",
        contentType: 'application/json; charset=utf-8',
        headers: {'X-CSRFToken': csrftoken},
        processData: false,
        data: JSON.stringify(formulario),
        success: function(data) {
            swal ( {
                icon: "success",
                title : "Dados enviados com sucesso!! " , 
                button: "Ok",
              } ) ;
        },
        error: function(data) {
            swal ( {
                icon: "error",
                text : "Erro no envio dos Dados!! " , 
                button: "Ok",
              } ) ;
            
        }
    });
    console.log('enviado');

}

function validarDados(formulario) {
    return true;
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

{/* <option value="escolha_multipla" selected>Múltipla Escolha</option>
<option value="caixa_selecao">Caixa de seleção</option>
<option value="resposta_curta">Resposta Curta</option>
<option value="resposta_longa">Parágrafo</option> */}
