from rest_framework.views import APIView
from rest_framework.response import Response

from random import choice
import jwt
from django.conf import settings
import time
from django.utils import timezone

from email.mime.text import MIMEText
import smtplib

from django_redis import get_redis_connection
from django.core.cache import cache
from user.models import User, UserRole, UserInfo, Students
from loggings.models import Loggings
from data.models import Experi, Process

class GetCodeView(APIView):
    '''
    发送邮箱验证码
    '''
    def generate_code(self):
        """
        生成六位数字的验证码
        """
        seeds = "1234567890"
        random_str = []
        for i in range(6):
            random_str.append(choice(seeds))

        return "".join(random_str)

    def send(self, email, content):
        """
        发送验证码
        """
        subject = "验证码"#邮件标题
        sender = "bistuserve@163.com"#发送方
        recver = email#接收方
        password = "CGMUXGLYQAYUGZFL" #是授权码不是密码

        message = MIMEText(content,"plain","utf-8")
        #content 发送内容     "plain"文本格式   utf-8 编码格式
        message['Subject'] = subject #邮件标题
        message['To'] = recver #收件人
        message['From'] = sender #发件人
        
        smtp = smtplib.SMTP_SSL("smtp.163.com",994) #实例化smtp服务器
        smtp.login(sender,password)#发件人登录
        smtp.sendmail(sender,[recver],message.as_string()) #as_string 对 message 的消息进行了封装
        smtp.close()

    def post(self, request, *args, **kwargs):
        email = request.data['email']
        
        redis_conn = get_redis_connection('verify_codes')

        # 判断一分钟内是否已经发送过一次
        send_flag = redis_conn.get('send_flag_%s' % email) 
        if not send_flag:
            # 验证码过期时间
            minute = 10
            codeexpire = 60 * minute  # 600秒，默认10分钟
            # 生成验证码
            code = self.generate_code()
            message = '您好，您的验证码为{0}，过期时间为{1}分钟。'.format(code, minute)
            # 发送验证码
            self.send(email, message)

            redis_conn.setex('sms_%s' % email, codeexpire, code)  # 默认600秒10分钟过期时间
            # 存储一个标记，表示此手机号已发送过短信，标记有效期为60s
            redis_conn.setex('send_flag_%s' % email, 60, 1)

            data = {
                'message': '已向您的邮箱发送验证码！',
                'code': 'info'
            }

            Loggings.objects.create(status=2, describe='email:{0},message:{1}'.format(email,data['message']))
            return Response(data)
        else:

            data = {
                'message': '前一分钟内已向您的邮箱发送验证码！',
                'code': 'warn'
            }

            Loggings.objects.create(status=1, describe='email:{0},message:{1}'.format(email,data['message']))
            return Response(data)


class RegisterView(APIView):
    '''
    前端用户注册
    '''
    def post(self, request, *args, **kwargs):
        email = request.data['email']
        password = request.data['password']
        code = request.data['code']

        redis_conn = get_redis_connection('verify_codes')
        send_flag = redis_conn.get('sms_%s' % email)

        # 如果取不到标记，则说明验证码过期
        if not send_flag:  
            data = {
                'message': '短信验证码已过期',
                'code': 'error'
            }

            Loggings.objects.create(status=0, describe='email:{0},message:{1}'.format(email,data['message']))
            return Response(data)
        else:
            if str(send_flag.decode()) != str(code):
                data = {
                    'message': '验证码错误',
                    'code': 'error'
                }

                Loggings.objects.create(status=0, describe='email:{0},message:{1}'.format(email,data['message']))
                return Response(data)

            try:
                User.objects.create(email=email, password=password)
                UserRole.objects.create(email=email)
                UserInfo.objects.create(email=email)

                data = {
                    'message': '注册成功',
                    'code': 'info'
                }

                Loggings.objects.create(status=2, describe='email:{0},message:{1}'.format(email,data['message']))
                return Response(data)
            except Exception as error:
                data = {
                    'message': '该用户已注册',
                    'error': error,
                    'code': 'error'
                }

                Loggings.objects.create(status=0, describe='email:{0},message:{1},error:{2}'.format(email,data['message'],error))
                return Response(data)


class LoginView(APIView):
    '''
    前端用户登录
    '''
    def post(self, request, *args, **kwargs):
        email = request.data['email']
        password = request.data['password']
        
        # 超级管理员账号和密码：
        # superAdmin 和 123456
        # 判断是否是超级管理员
        if email == 'superAdmin' and password == '123456':
            headers = {
                'alg': "HS256",  # 声明所使用的算法
                "typ": "JWT"    #令牌类型，也就是 JWT。
            }
            payload = {
                # 秒、分钟、小时、天
                "exp": int(time.time()) + 1 * 60 * 60 * 24 * 30,# 过期时间设置为 当前时间加30天
                "iat": int(time.time()),
                "email": email,
                "role": 0,
                'is_manage': True,
                'is_superAdmin': True
            }

            # jwt(json web token)
            token = jwt.encode(payload,  # payload, 有效载体 
                settings.SECRET_KEY,  # 进行加密签名的密钥
                algorithm="HS256",  # 指明签名算法方式, 默认也是HS256
                headers=headers  # json web token 数据结构包含两部分, payload(有效载体), headers(标头)
            )

            data = {
                'message': '登录成功',
                'code': 'info',
                'token': token,
                'email': 'superAdmin',
                'is_superAdmin': True
            }

            Loggings.objects.create(status=0, describe='role:superAdmin,message:{0}'.format(data['message']))
            return Response(data)
        else:
            user = User.objects.filter(email=email)
            if not user[0].is_active:
                data = {
                    'message': '该账号已被禁用,请联系管理员',
                    'code': 'error'
                }

                Loggings.objects.create(status=0, describe='email:{0},message:{1}'.format(email,data['message']))
                return Response(data)

            if not len(user) == 0:
                if user[0].password == password:
                    headers = {
                        'alg': "HS256",  # 声明所使用的算法
                        "typ": "JWT"    #令牌类型，也就是 JWT。
                    }
                    payload = {
                        "uid": user[0].id,
                        "email": user[0].email,
                        # 秒、分钟、小时、天
                        "exp": int(time.time()) + 1 * 60 * 60 * 24 * 30,# 过期时间设置为 当前时间加30天
                        "iat": int(time.time()),
                        'is_superAdmin': False
                    }

                    role = UserRole.objects.filter(email=email)
                    payload['role'] = role[0].role
                    payload['is_manage'] = role[0].is_manage

                    # jwt(json web token)
                    token = jwt.encode(payload,  # payload, 有效载体 
                        settings.SECRET_KEY,  # 进行加密签名的密钥
                        algorithm="HS256",  # 指明签名算法方式, 默认也是HS256
                        headers=headers  # json web token 数据结构包含两部分, payload(有效载体), headers(标头)
                    )

                    data = {
                        'message': '登录成功',
                        'code': 'info',
                        'token': token,
                        'email': email
                    }

                    Loggings.objects.create(status=0, describe='email:{0},message:{1}'.format(email,data['message']))
                    return Response(data)

                else:
                    data = {
                        'message': '密码错误',
                        'code': 'error'
                    }

                    Loggings.objects.create(status=0, describe='email:{0},message:{1}'.format(email,data['message']))
                    return Response(data)
            else:
                data = {
                    'message': '此邮箱还未注册',
                    'code': 'error'
                }

                Loggings.objects.create(status=0, describe='email:{0},message:{1}'.format(email,data['message']))
                return Response(data)
            
class ForgetPasswordView(APIView):
    '''
    忘记密码
    '''
    def send(self, email, content):
        """
        发送密码
        """
        subject = "密码"#邮件标题
        sender = "bistuserve@163.com"#发送方
        recver = email#接收方
        password = "CGMUXGLYQAYUGZFL" #是授权码不是密码

        message = MIMEText(content,"plain","utf-8")
        #content 发送内容     "plain"文本格式   utf-8 编码格式
        message['Subject'] = subject #邮件标题
        message['To'] = recver #收件人
        message['From'] = sender #发件人
        
        smtp = smtplib.SMTP_SSL("smtp.163.com",994) #实例化smtp服务器
        smtp.login(sender,password)#发件人登录
        smtp.sendmail(sender,[recver],message.as_string()) #as_string 对 message 的消息进行了封装
        smtp.close()

    def post(self, request, *args, **kwargs):
        email = request.data['email']
        
        redis_conn = get_redis_connection('verify_codes')
        send_flag = redis_conn.get('send_password_%s' % email) 

        if not send_flag:
            user = User.objects.filter(email=email)
            if len(user) == 0:
                data = {
                    'message': '此邮箱还未注册',
                    'code': 'error'
                }

                Loggings.objects.create(status=0, describe='email:{0},message:{1}'.format(email,data['message']))
                return Response(data)
            else:
                password = user[0].password
                message = '您好，您的密码为{0}，请勿告诉他人。'.format(password)
                # 发送密码
                self.send(email, message)

                data = {
                    'message': '已向您的邮箱发送密码！',
                    'code': 'info'
                }

                expire = 60 * 60  # 60分钟
                redis_conn.setex('send_password_%s' % email, expire, password)
                Loggings.objects.create(status=2, describe='email:{0},message:{1}'.format(email,data['message']))
                return Response(data)

        else:
            data = {
                'message': '已向您的邮箱发送密码！',
                'code': 'info'
            }
            
            Loggings.objects.create(status=2, describe='email:{0},message:{1}'.format(email,data['message']))
            return Response(data)

class GetPasswordView(APIView):
    '''
    获取密码
    '''
    def post(self, request, *args, **kwargs):
        token=request.META.get("HTTP_TOKEN")
        decode = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        email = decode['email']
        
        password = cache.get('password_'+ email)
        if password: return Response(password)

        user = User.objects.filter(email=email)
        data = {
            'code': 'get',
            'password': user[0].password
        }
        cache.set('password_'+email, data, 360)
        Loggings.objects.create(status=2, describe='email:{0},message:获取密码'.format(email))
        return Response(data)

class GetUserInfoView(APIView):
    '''
    获取个人信息
    '''
    def post(self, request, *args, **kwargs):
        token=request.META.get("HTTP_TOKEN")
        decode = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        email = decode['email']
        
        user = cache.get('user_'+ email)
        if user: return Response(user)

        userRole = UserRole.objects.filter(email=email)
        userInfo = UserInfo.objects.filter(email=email)

        if len(userRole) == 0 or len(userInfo) == 0:
            data = {
                'code': 'error',
                'message': '您还未填写个人信息'
            }

            Loggings.objects.create(status=1, describe='email:{0},message:{1}'.format(email,data['message']))
            return Response(data)
        else:
            response = {
                'role': userRole[0].role,
                'is_check': userRole[0].is_check,
                'is_manage': userRole[0].is_manage,

                'email': userInfo[0].email,
                'name': userInfo[0].name,
                'school': userInfo[0].school,
                'phone': userInfo[0].phone
            }

            stu = []
            ### 身份为老师并且以验证为真
            if userRole[0].role == 1:
                students = Students.objects.filter(teacher=user.email)
                if len(students) == 0:
                    # 没有学生
                    stu = []
                else:
                    for student in students:
                        stu.append({
                            'student': student.student,
                            'is_check': student.is_check
                        })

                    response.update({
                        'students': stu
                    })

            data = {
                'code': 'get',
                'response': response
            }
            cache.set('user_'+email, data, 360)
            Loggings.objects.create(status=2, describe='email:{0},message:获取个人信息'.format(email))
            return Response(data)

class SetInfoView(APIView):
    '''
    设置个人信息
    '''
    def post(self, request, *args, **kwargs):
        token=request.META.get("HTTP_TOKEN")
        decode = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        email = decode['email']

        role = request.data["role"]
        name = request.data["name"]
        school = request.data["school"]
        phone = request.data["phone"]

        userRole = UserRole.objects.filter(email=email)
        userInfo = UserInfo.objects.filter(email=email)

        if len(userRole) == 0:
            if role == 2:
                UserRole.objects.create(email=email,role=role,is_check=1)
            else:
                UserRole.objects.create(email=email,role=role,is_check=0)


        if len(userInfo) == 0:
            UserInfo.objects.create(email=email,name=name,school=school,phone=phone)
        else:
            userInfo[0][name] = name
            userInfo[0][school] = school
            userInfo[0][phone] = phone
            userInfo[0].save()
        
        data = {
            'code': 'info',
            'message': '创建成功'
        }

        Loggings.objects.create(status=2, describe='email:{0},message:{1}'.format(email,data['message']))
        return Response(data)


class GetMyStudentsView(APIView):
    '''
    获得我的学生
    '''
    def getOnlineDataNumber(self, email):
        '''
        获取今日在线处理数量
        '''
        today = timezone.now().date()
        tomorrow = timezone.now().date() + timezone.timedelta(days=1)
        # __gte 表示 "greater than or equal to"，即 "大于或等于"
        # __lt 表示 "less than"，即 "小于"。
        # __contains：表示包含指定值的字段
        onlines = Loggings.objects.filter(status=4,time__gte=today,time__lt=tomorrow, describe__contains=email)
        
        # types = ['JV', 'XRD', 'IPCE', 'PL', 'ABS']
        onlineTodayNumber = [0, 0, 0, 0, 0]
        for online in onlines:
            if 'JV' in online.describe:
                onlineTodayNumber[0] += 1
            elif 'XRD' in online.describe:
                onlineTodayNumber[1] += 1
            elif 'IPCE' in online.describe:
                onlineTodayNumber[2] += 1
            elif 'PL' in online.describe:
                onlineTodayNumber[3] += 1
            elif 'ABS' in online.describe:
                onlineTodayNumber[4] += 1
        return onlineTodayNumber

    def getExperiNumber(self, email):
        '''
        获取今日experi数据
        '''
        today = timezone.now().date()
        tomorrow = timezone.now().date() + timezone.timedelta(days=1)
        experis = Experi.objects.filter(email=email,time__gte=today,time__lt=tomorrow)
        
        experiTodayNumber = [0, 0, 0, 0, 0]
        for experi in experis:
            experiTodayNumber[experi.type] += 1
        
        return experiTodayNumber

    def getProcessTodayNumber(self, email):
        '''
        获取今日上传工艺文件
        '''
        today = timezone.now().date()
        tomorrow = timezone.now().date() + timezone.timedelta(days=1)
        process = Process.objects.filter(email=email,time__gte=today,time__lt=tomorrow)
        
        return len(process)
    
    def post(self, request, *args, **kwargs):
        token=request.META.get("HTTP_TOKEN")
        decode = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        email = decode['email']
        # students = cache.get('students_' + email)
        # if students: return Response(students)

        responses = []
        students = Students.objects.filter(teacher=email)
        if len(students) == 0:
            # 没有学生
            print(email)
        else:
            for student in students:
                userInfo = UserInfo.objects.filter(email=student.student)
                experis = Experi.objects.filter(email=student.student)
                process = Process.objects.filter(email=student.student)
                
                typeNumber = [0, 0, 0, 0, 0]
                for experi in experis:
                    typeNumber[experi.type] += 1
                onlineTodayNumber = self.getOnlineDataNumber(email)
                experiTodayNumber = self.getExperiNumber(email)
                processTodayNumber = self.getProcessTodayNumber(email)

                response = {
                    'email': student.student,
                    'is_check': student.is_check,
                    "name": userInfo[0].name,
                    "school": userInfo[0].school,
                    "phone": userInfo[0].phone,
                    "typeNumber": typeNumber,
                    "processNumber": len(process),
                    "onlineTodayNumber": onlineTodayNumber,
                    "experiTodayNumber": experiTodayNumber,
                    "processTodayNumber": processTodayNumber
                }
            
                responses.append(response)

        data = {
            'code': 'get',
            'responses': responses
        }
        cache.set('students_' + email, data, 360)
        Loggings.objects.create(status=2, describe='email:{0},message:获得我的学生数据信息'.format(email))
        return Response(data)


class AddStudentView(APIView):
    '''
    添加我的学生
    '''
    def post(self, request, *args, **kwargs):
        token=request.META.get("HTTP_TOKEN")
        decode = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        email = decode['email']

        emailArr = request.data['emailArr']
        for student in emailArr:
            Students.objects.create(teacher=email,student=student,is_check=0)
        
        data = {
            'code': 'info',
            'message': '成功添加学生'
        }
        Loggings.objects.create(status=2, describe='email:{0},message:{1}'.format(email,data['message']))
        return Response(data)


class GetAllStudentsView(APIView):
    '''
    获得全部学生
    '''
    def post(self, request, *args, **kwargs):
        stus = cache.get('students')
        if stus: return Response(stus)

        students = UserRole.objects.filter(role=2)
        response = {}
        for student in students:
            studentInfo = UserInfo.objects.get(email=student.email)
            school = studentInfo.school
            try:
                response[school].append({
                    'email': student.email,
                    'name': studentInfo.name,
                })
            except:
                response[school] = []
                response[school].append({
                    'email': student.email,
                    'name': studentInfo.name,
                })

        data = {
            'code': 'get',
            'response': response
        }

        cache.set('students', data, 360)
        Loggings.objects.create(status=2, describe='message:获得全部学生')
        return Response(data)


class GetNumberView(APIView):
    '''
    统计人数和数据
    '''
    def post(self, request, *args, **kwargs):
        numbers = cache.get('numbers')
        if numbers: return Response(numbers)

        users = User.objects.all()
        manager = UserRole.objects.filter(is_manage=True)
        teacher = UserRole.objects.filter(role=1, is_check=1)
        
        experi = Experi.objects.all()
        process = Process.objects.all()
        onlines = Loggings.objects.filter(status=4)

        response = {
            'userNumber': len(users),
            'managerNumber': len(manager),
            'teacherNumber': len(teacher),
            'exprisNumber': len(experi),
            'prosNumber': len(process),
            'onlinesNumber': len(onlines),
        }

        data = {
            'code': 'get',
            'response': response
        }

        cache.set('numbers', data, 360)
        Loggings.objects.create(status=2, describe='message:统计人数和数据')
        return Response(data)

class GetInfosView(APIView):
    '''
    全员信息
    '''
    def post(self, request, *args, **kwargs):
        numberInfos = cache.get('numberInfos')
        if numberInfos: return Response(numberInfos)

        responses = []
        users = User.objects.all()
        for user in users:
            response = {
                "is_active": user.is_active,
                "email": user.email,
                "time": user.time
            }

            userRole = UserRole.objects.filter(email=user.email)
            if len(userRole) == 0:
                # 没有身份的人士
                print(user.email)
            else:
                response.update({
                    "role": userRole[0].role,
                    "is_check": userRole[0].is_check,
                    "is_manage": userRole[0].is_manage
                })

                # 身份为老师并且以验证为真
                if userRole[0].role == 1 and userRole[0].is_check == 1:
                    students = Students.objects.filter(teacher=user.email)
                    if len(students) == 0:
                        # 没有学生
                        print(user.email)
                    else:
                        stu = []
                        for student in students:
                            stu.append({
                                'student': student.student,
                                'is_check': student.is_check
                            })
                        response.update({
                                'students': stu
                        })

            userInfo = UserInfo.objects.filter(email=user.email)
            if len(userInfo) == 0:
                # 没有基础信息的人士
                print(user.email)
            else:
                response.update({
                    "name": userInfo[0].name,
                    "school": userInfo[0].school,
                    "phone": userInfo[0].phone
                })
            
            experis = Experi.objects.filter(email=user.email)
            typeNumber = [0, 0, 0, 0, 0]
            for experi in experis:
                typeNumber[experi.type] += 1
            response.update({
                "typeNumber": typeNumber
            })

            process = Process.objects.filter(email=user.email)
            response.update({
                "processNumber": len(process)
            })
            
            responses.append(response)

        data = {
            'code': 'get',
            'responses': responses
        }

        cache.set('numberInfos', data, 360)
        Loggings.objects.create(status=2, describe='message:获得全员信息')
        return Response(data)


class GetAllView(APIView):
    '''
    获得全体成员
    '''
    def post(self, request, *args, **kwargs):
        all = cache.get('all')
        if all: return Response(all)

        userInfo = UserInfo.objects.all()
        responses = []
        for i in range(2):
            schoolResponse = []
            userInfo = UserInfo.objects.filter(school=i)
            for info in userInfo:
                response = {
                    "email": info.email,
                    "name": info.name,
                }
                schoolResponse.append(response)

            responses.append(
                {
                    'school': i,
                    "response": schoolResponse
                }
            )

        data = {
            'code': 'get',
            'responses': responses
        }

        cache.set('all', data, 360)
        Loggings.objects.create(status=2, describe='message:获得全体成员')
        return Response(data)