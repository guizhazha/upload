# Generated by Django 4.1.4 on 2023-01-31 12:18

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('data', '0002_alter_experi_rank_alter_experi_time_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='experi',
            name='time',
            field=models.DateTimeField(default=datetime.datetime(2023, 1, 31, 12, 18, 28, 636930)),
        ),
        migrations.AlterField(
            model_name='process',
            name='time',
            field=models.DateTimeField(default=datetime.datetime(2023, 1, 31, 12, 18, 28, 636930)),
        ),
    ]
