from django.urls import path
from django.contrib.auth import views as auth_views
from .views import UsuarioCreateView, PerfilUpdate

urlpatterns = [
    path('login/', auth_views.LoginView.as_view(
        template_name = 'usuarios/login.html'
    ), name='login'),
    path('logout/', auth_views.LogoutView.as_view(), name='logout'),
    path('registrar/', UsuarioCreateView.as_view(), name='registrar'), 

    path('alterar-perfil/', PerfilUpdate.as_view(), name="alterar-perfil"),


]
