# Generated by Django 4.1.4 on 2023-01-31 12:30

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('loggings', '0003_alter_loggings_time'),
    ]

    operations = [
        migrations.AlterField(
            model_name='loggings',
            name='time',
            field=models.DateTimeField(default=datetime.datetime(2023, 1, 31, 12, 30, 15, 931606)),
        ),
    ]
