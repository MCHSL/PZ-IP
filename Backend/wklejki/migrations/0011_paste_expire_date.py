# Generated by Django 4.0.3 on 2022-04-11 18:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('wklejki', '0010_remove_report_reviewed_by'),
    ]

    operations = [
        migrations.AddField(
            model_name='paste',
            name='expire_date',
            field=models.DateTimeField(null=True),
        ),
    ]
