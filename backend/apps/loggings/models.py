from django.db import models
from datetime import datetime

# Create your models here.
class Loggings(models.Model):
	STATUS_CHOICES = (
        (0, "error"),
        (1, "warn"),
        (2, "info"),
        (3, "debug"),
        (4, "trace")
    )
	# 日志类型
	status = models.IntegerField(choices=STATUS_CHOICES)

	describe = models.TextField()

    # 创建时间
	time = models.DateTimeField(default=datetime.now())

