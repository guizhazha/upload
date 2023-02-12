from django.db import models
from datetime import datetime

# Create your models here.
def ExperiPath(instance, filename):
		return "{0}/{1}/{2}/{3}".format("Experi", instance.email, instance.type, filename)
	
class Experi(models.Model):
	email = models.EmailField()

	TYPE_CHOICES = (
		(0, "JV"),
        (1, "XRD"),
        (2, "IPCE"),
        (3, "PL"),
        (4, "ABS"),
    )
    # 数据类型
	type = models.IntegerField(choices=TYPE_CHOICES)

	test_time = models.CharField(max_length=200)
	process_id = models.CharField(max_length=200)
	sample_id = models.CharField(max_length=200)
	data_name = models.CharField(max_length=500)

	content = models.TextField()
	data_path = models.FileField(upload_to=ExperiPath)

    # 创建时间
	time = models.DateTimeField(default=datetime.now())

	RANK_CHOICES = (
        (0, "未知"),
        (5, "一级好"),
        (4, "一般好"),
        (3, "一般"),
        (2, "不怎么好"),
        (1, "非常差"),
    )
	# 数据等级
	rank = models.IntegerField(choices=RANK_CHOICES)

	isPublic = models.BooleanField(default=False)
	# 逻辑删除
	is_delete = models.BooleanField(default=False)

	class Meta:
		unique_together = (
			('email', 'type', 'data_name'),    # 联合唯一
		)

def ProcessPath(instance, filename):
		return "{0}/{1}/{2}".format("Process", instance.email, filename)
	
class Process(models.Model):
	email = models.EmailField()

	process_id = models.CharField(max_length=200)
	data_name = models.CharField(max_length=500)

	content = models.TextField()
	data_path = models.FileField(upload_to=ProcessPath)

    # 创建时间
	time = models.DateTimeField(default=datetime.now())

	class Meta:
		unique_together = (
			('email', 'data_name'),    # 联合唯一
		)	