const CORES = [
    "#25CCF7","#FD7272","#54a0ff","#00d2d3",
    "#1abc9c","#2ecc71","#3498db","#9b59b6","#34495e",
    "#16a085","#27ae60","#2980b9","#8e44ad","#2c3e50",
    "#f1c40f","#e67e22","#e74c3c","#ecf0f1","#95a5a6",
    "#f39c12","#d35400","#c0392b","#bdc3c7","#7f8c8d",
    "#55efc4","#81ecec","#74b9ff","#a29bfe","#dfe6e9",
    "#00b894","#00cec9","#0984e3","#6c5ce7","#ffeaa7",
    "#fab1a0","#ff7675","#fd79a8","#fdcb6e","#e17055",
    "#d63031","#feca57","#5f27cd","#54a0ff","#01a3a4"
]

$(document).ready(function(){
    atualizarGraficos(); 
    atualizarRespostasTexto(); 
});

function atualizarGraficos() {
    let cont_grafico = 0;
    $('.grafico').each(function() {
        let dadosGraficosFiltrados = dadosGraficos.filter(dado => dado.grafico)
        console.log(dadosGraficosFiltrados)
        console.log(`Entrou no if. Cont: ${cont_grafico}`);
        let ctx = this;
        let opcoes = {}
        if (dadosGraficosFiltrados[cont_grafico].tipo_grafico == 'pie') {
            opcoes = {
                responsive: true,
                maintainAspectRatio: false
            }
        }
        // type, data, options
        let alternativas = []
        let votos = []
        for(cont=0; cont<dadosGraficosFiltrados[cont_grafico].alternativas.length; cont++) {
            alternativas.push(dadosGraficosFiltrados[cont_grafico].alternativas[cont].texto)
        }
        for(cont=0; cont<dadosGraficosFiltrados[cont_grafico].alternativas.length; cont++) {
            votos.push(dadosGraficosFiltrados[cont_grafico].alternativas[cont].votos)
        }
        let chartGraph = new Chart(ctx, {
            type: dadosGraficosFiltrados[cont_grafico].tipo_grafico,
            data: {
                labels: alternativas,
                datasets: [{
                    //label: dadosGraficos[0].enunciado,
                    data: votos,
                    backgroundColor: CORES,
                    barThickness: 80,
                }]
            },
            options: {
                plugins: {
                    legend: {
                        display: false
                    }
                },
                ...opcoes
            }
        });
    
    console.log(cont_grafico)
    ++cont_grafico;
    });  
}

function atualizarRespostasTexto() {
    let dadosGraficosFiltrados = dadosGraficos.filter(dado => !dado.grafico);
    for(cont = 0; cont < dadosGraficosFiltrados.length; cont++) {
        alternativasElementos = ''
        console.log("asdasdsadsadasdasdsadasdsad")
        console.log(dadosGraficosFiltrados[cont].respostas)

        for(contAlternativa = 0; contAlternativa < dadosGraficosFiltrados[cont].respostas.length; contAlternativa++) {
            console.log("entrou asdasdsa")
            alternativasElementos += `
                <p class="p-3 bg-cinza-claro rounded">${dadosGraficosFiltrados[cont].respostas[contAlternativa]}</p>
            `
        }
        $("#questao-texto").append(`
            <div class="row mt-4">
                <div class="col-12">
                    <div class="card">
                        
                        <div class="card-header">
                            <h5 class="text-center">${ dadosGraficosFiltrados[cont].enunciado }</h5>
                        </div>
                
                        <div class="card-body">
                            ${alternativasElementos}  
                        </div>
                    </div>
                </div>
            </div>
        `);
    }
}