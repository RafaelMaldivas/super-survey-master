from django.urls import path
from django.views.generic.list import ListView
from . import views
from .models import Pesquisa

urlpatterns = [
    path('formulario/criacao/', views.create_form, name='create_form'),
    path('formulario/criacao/formulario', views.criar_formulario, name='new_form'),
    path('formulario/listagem', views.listagem, name='lista'),
    path('formulario/resultado/<int:pesquisa_id>', views.get_resultados, name='resultado'),
]
