# Generated by Django 4.1.4 on 2023-01-04 14:12

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='time',
            field=models.DateTimeField(default=datetime.datetime(2023, 1, 4, 14, 12, 25, 653521)),
        ),
    ]
