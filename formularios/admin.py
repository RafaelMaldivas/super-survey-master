from django.contrib import admin
from formularios import models

admin.site.register([models.Pesquisa, models.Questao, models.Alternativa, models.RespostaTexto])
