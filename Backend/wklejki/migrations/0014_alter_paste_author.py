# Generated by Django 4.0.4 on 2022-06-07 10:18

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('wklejki', '0013_tag_paste_tags'),
    ]

    operations = [
        migrations.AlterField(
            model_name='paste',
            name='author',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='pastes', to=settings.AUTH_USER_MODEL),
        ),
    ]
