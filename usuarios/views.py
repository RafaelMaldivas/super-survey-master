from django.views.generic.edit import CreateView, UpdateView
from django.contrib.auth.models import Group
from django.shortcuts import get_object_or_404
from .forms import UsuarioForm
from django.urls import reverse_lazy
from .models import Perfil


class UsuarioCreateView(CreateView):
    template_name = 'usuarios/cadastro.html'
    form_class = UsuarioForm
    success_url = reverse_lazy('login')

    def form_valid(self, form):
        grupo = get_object_or_404(Group, name="usuario")

        url = super().form_valid(form)

        self.object.groups.add(grupo)

        self.object.save()

        Perfil.objects.create(usuario=self.object)

        return url


class PerfilUpdate(UpdateView):
    model = Perfil
    template_name = 'usuarios/alterar-perfil.html'
    success_url = reverse_lazy('index')
    fields = ['nome_completo', 'cpf', 'telefone']

    def get_object(self, queryset=None):
        self.object = get_object_or_404(Perfil, usuario=self.request.user) 
        return self.object

