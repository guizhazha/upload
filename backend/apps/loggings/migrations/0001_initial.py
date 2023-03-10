# Generated by Django 4.1.4 on 2022-12-28 19:33

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Loggings',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.IntegerField(choices=[(0, 'error'), (1, 'warn'), (2, 'info'), (3, 'debug'), (4, 'trace')])),
                ('describe', models.TextField()),
                ('time', models.DateTimeField(default=datetime.datetime(2022, 12, 28, 19, 33, 2, 103534))),
            ],
        ),
    ]
