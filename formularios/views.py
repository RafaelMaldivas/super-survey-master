from django.db.models.aggregates import Count
from django.http.response import JsonResponse
from django.shortcuts import render, get_object_or_404
from django.http import HttpResponseRedirect, request
from django.urls import reverse
from formularios import models as formularios_models
import json
from datetime import datetime, timedelta
from django.db import transaction
import json

from .models import Pesquisa


def listagem(request): 
    if not request.user.is_authenticated:
        return  HttpResponseRedirect(reverse('login')) 

    search = request.GET.get('busca')

    if search:
        lista_pesq = Pesquisa.objects.filter(titulo__icontains = search)
    else:
        lista_pesq = Pesquisa.objects.all().filter(criador_id = request.user.id).order_by('titulo')

    return render(request, 'formularios/pesquisa_list.html',{'lista_pesq': lista_pesq})


def create_form(request):
    if not request.user.is_authenticated:
        return HttpResponseRedirect(reverse('login'))
    
    return render(request, 'formularios/formulario_criacao.html')

@transaction.atomic
def criar_formulario(request):
    de_para_tipo =  {
        "escolha_multipla": "multipla_escolha",
        "caixa_selecao": "caixa_de_selecao",
        "resposta_curta": "resposta_curta",
        "resposta_longa": "paragrafo"
    }
    parametros = json.loads(request.body)
    aceitando_resposta = parametros.get('aceitando_resposta')
    periodo = parametros.get('periodo')
    periodo_tipo = parametros.get('periodo_tipo')
    titulo = parametros.get('titulo')
    descricao = parametros.get('descricao')
    lista_perguntas = parametros.get('lista_perguntas')

    if periodo_tipo == 'dia':
        adicao_tempo = timedelta(days=int(periodo))
    elif periodo_tipo == 'mes':
        adicao_tempo = timedelta(days=30*int(periodo))
    elif periodo_tipo == 'ano':
        adicao_tempo = timedelta(days=365*int(periodo))
    
    pesquisa = formularios_models.Pesquisa.objects.create(
        titulo = titulo,
        data = datetime.now() + adicao_tempo,
        status = True if aceitando_resposta == '1' else False,
        descricao = descricao,
        criador = request.user,
    )
    for pergunta in lista_perguntas:
        questao = formularios_models.Questao.objects.create(
            tipo = de_para_tipo[pergunta.get('tipoPergunta')],
            enunciado = pergunta.get('enunciado'),
            pesquisa = pesquisa,
        )
        for alternativa in pergunta.get('alternativas'):
            formularios_models.Alternativa.objects.create(
                texto = alternativa,
                questao = questao
            )

    return JsonResponse(data={"msg": "sucesso"})

def get_resultados(request, pesquisa_id):
    if not request.user.is_authenticated:
        return HttpResponseRedirect(reverse('login'))
    pesquisa = get_object_or_404(formularios_models.Pesquisa, pk=pesquisa_id, criador=request.user)
    # radiobutton - gráfico de pizza
    # checkboc - histograma
    # input - mostra em tela, mas em histograma quando repetido
    # textarea - mostra em tela
    questoes = []
    for questao in pesquisa.questao_set.all():
        questao_dict = {}
        if questao.tipo in {"multipla_escolha", "caixa_de_selecao"}:
            questao_dict['grafico'] = True
            questao_dict['tipo_grafico'] = 'bar' if questao.tipo == "multipla_escolha" else 'pie'
            questao_dict['id_questao'] = questao.id
            questao_dict['enunciado'] = questao.enunciado        
            questao_dict['tipo'] = questao.tipo
            questao_dict['alternativas'] = [
                    {
                        "votos": alternativa.quantidade_selecionada, 
                        "texto": alternativa.texto
                    }
                    for alternativa in questao.alternativa_set.all()
                ]     
        else:
            questao_dict['grafico'] = False
            questao_dict['enunciado'] = questao.enunciado
            questao_dict['respostas'] = [texto_resposta.texto for texto_resposta in questao.respostatexto_set.all()]
        questoes.append(questao_dict)

    context = {
        "questoes": questoes,
        "questoes_json": json.dumps(questoes),
        "pesquisa": pesquisa,
    }
    return render(request, 'formularios/formulario_resultados.html', context)
