# Generated by Django 4.0.3 on 2022-03-27 17:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('wklejki', '0003_alter_paste_author'),
    ]

    operations = [
        migrations.AddField(
            model_name='paste',
            name='private',
            field=models.BooleanField(default=False),
        ),
    ]
