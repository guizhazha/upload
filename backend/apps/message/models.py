from django.db import models
from datetime import datetime

# Create your models here.
# 消息
class Message(models.Model):
	send_id = models.CharField(max_length=500, null=True)
	to_id = models.CharField(max_length=500, null=True)

	content = models.TextField()
	is_read = models.BooleanField(default=False)

    # 创建时间
	time = models.DateTimeField(default=datetime.now())

# 通知
class Notion(models.Model):
	content = models.TextField()
	
    # 创建时间
	time = models.DateTimeField(default=datetime.now())
