# Generated by Django 4.1.4 on 2022-12-28 19:33

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('is_active', models.BooleanField(default=True)),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('password', models.CharField(max_length=500)),
                ('time', models.DateTimeField(default=datetime.datetime(2022, 12, 28, 19, 33, 2, 95553))),
            ],
        ),
        migrations.CreateModel(
            name='UserInfo',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('name', models.CharField(max_length=500, null=True)),
                ('school', models.IntegerField(choices=[(0, '未知'), (1, '北京信息科技大学')], default=0)),
                ('phone', models.CharField(max_length=500, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='UserRole',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('role', models.IntegerField(choices=[(0, '未知'), (1, '老师'), (2, '学生')], default=0)),
                ('is_check', models.IntegerField(choices=[(0, '未验证'), (1, '已验证为真'), (2, '已验证为假')], default=0)),
                ('is_manage', models.BooleanField(default=False)),
            ],
        ),
        migrations.CreateModel(
            name='Students',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('teacher', models.CharField(max_length=500)),
                ('student', models.CharField(max_length=500)),
                ('is_check', models.IntegerField(choices=[(0, '未验证'), (1, '已验证为真'), (2, '已验证为假')], default=0)),
            ],
            options={
                'unique_together': {('teacher', 'student')},
            },
        ),
    ]