from django.db import models
from datetime import datetime

# Create your models here.
class User(models.Model):
	# 是否注销
	is_active = models.BooleanField(default=True)

	email = models.EmailField(unique=True)
	password = models.CharField(max_length=500)

	# 创建时间
	time = models.DateTimeField(default=datetime.now())

# Create your models here.
class UserRole(models.Model):
	email = models.EmailField(unique=True)
	ROLE_CHOICES = (
		(0, "未知"),
        (1, "老师"),
        (2, "学生"),
    )
	# 学生或者老师身份
	role = models.IntegerField(choices=ROLE_CHOICES, default=0)

	CHECK_CHOICES = (
		(0, "未验证"),
        (1, "已验证为真"),
        (2, "已验证为假"),
    )
	# 身份认证
	is_check = models.IntegerField(choices=CHECK_CHOICES, default=0)

	is_manage = models.BooleanField(default=False)

class UserInfo(models.Model):
	email = models.EmailField(unique=True)
	name = models.CharField(max_length=500, null=True)

	SCHOOL_CHOICES = (
		(0, "未知"),
        (1, "北京信息科技大学"),
    )
	school = models.IntegerField(choices=SCHOOL_CHOICES, default=0)
	phone = models.CharField(max_length=500, null=True)

class Students(models.Model):
	teacher = models.CharField(max_length=500)
	student = models.CharField(max_length=500)

	CHECK_CHOICES = (
		(0, "未验证"),
        (1, "已验证为真"),
        (2, "已验证为假"),
    )
	# 身份认证
	is_check = models.IntegerField(choices=CHECK_CHOICES, default=0)

	class Meta:
		unique_together = (
            ('teacher', 'student'),    # 联合唯一
        )