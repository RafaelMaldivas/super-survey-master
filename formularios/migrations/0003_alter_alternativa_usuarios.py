# Generated by Django 3.2.7 on 2021-10-08 21:51

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('formularios', '0002_alter_alternativa_usuarios'),
    ]

    operations = [
        migrations.AlterField(
            model_name='alternativa',
            name='usuarios',
            field=models.ManyToManyField(blank=True, null=True, to=settings.AUTH_USER_MODEL),
        ),
    ]
