from django.db import models
from django.contrib.auth.models import User
from django.db.models.aggregates import Count

class Pesquisa(models.Model):
    titulo = models.CharField(max_length=255)
    data = models.DateTimeField(auto_now_add=True)
    status = models.BooleanField(default=True)
    descricao = models.TextField(max_length=255, verbose_name="Descrição")
    criador = models.ForeignKey(User, on_delete=models.CASCADE)

   
    def countQuest(self):
        return self.questao_set.all().count()

    def __str__(self):
        return self.titulo


class Questao(models.Model):
    TIPOS = (
        ('multipla_escolha', 'Múltipla Escolha'),
        ('caixa_de_selecao', 'Caixa de seleção'),
        ('resposta_curta', 'Resposta Curta'),
        ('paragrafo', 'Parágrafo')
    )
    tipo = models.CharField(max_length=255, choices=TIPOS)
    enunciado = models.CharField(max_length=255)
    pesquisa = models.ForeignKey(Pesquisa, on_delete=models.CASCADE)
            

    def __str__(self):
        return f"{self.enunciado} - {self.tipo}"


class Alternativa(models.Model):
    texto = models.CharField(max_length=255)
    questao = models.ForeignKey(Questao, on_delete=models.CASCADE)
    usuarios = models.ManyToManyField(User, blank=True)

    def __str__(self):
        return f"{self.questao} -> {self.texto}"

    @property
    def quantidade_selecionada(self):
        return self.usuarios.all().count()

class RespostaTexto(models.Model):
    texto = models.TextField(null=False)
    usuarios = models.ManyToManyField(User, blank=True)
    questao = models.ForeignKey(Questao, on_delete=models.CASCADE)