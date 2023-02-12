from rest_framework.views import APIView
from rest_framework.response import Response

import jwt
from django.conf import settings
from django.core.cache import cache
import json
from django.utils import timezone
import datetime
from dateutil.relativedelta import relativedelta

from user.models import User, UserRole, UserInfo, Students
from loggings.models import Loggings
from data.models import Experi, Process

from utils.dealSQL import changeType

class CheckExperiNameView(APIView):
    '''
    Experi是否重名
    '''
    def post(self, request, *args, **kwargs):
        token=request.META.get("HTTP_TOKEN")
        decode = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        email = decode['email']

        type = changeType(request.data['dataType'])
        data_name = request.data['dataName']
        
        experi = Experi.objects.filter(email=email, type=type, data_name=data_name)
        if len(experi) == 0:
            # 还不存在
            data = {
                'code': 'check',
                'isExist': False
            }

            return Response(data)
        else:
            data = {
                'code': 'check',
                'isExist': True
            }

            return Response(data)


class UploadExperiView(APIView):
    '''
    上传Experi数据
    '''
    def post(self, request, *args, **kwargs):
        token=request.META.get("HTTP_TOKEN")
        decode = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        email = decode['email']

        type = changeType(request.data['dataType'])
        test_time = request.data['testTime']
        process_id = request.data['processId']
        sample_id = request.data['sampleId']
        data_name = request.data['dataName']
        content = request.data['content']
        data_path = request.data['data']
        rank = 0
        
        experi = Experi.objects.create(email=email, type=type, 
            test_time=test_time, process_id=process_id, sample_id=sample_id,
            data_name=data_name, content=content, data_path=data_path, rank=rank)
        
    
        data = {
            'code': 'upload',
            'message': '上传Experi数据成功'
        }

        Loggings.objects.create(status=2, describe='email:{0},message:{1}'.format(email,data['message']))
        return Response(data)

class UploadProgressView(APIView):
    '''
    上传Progress数据
    '''
    def post(self, request, *args, **kwargs):
        token=request.META.get("HTTP_TOKEN")
        decode = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        email = decode['email']

        process_id = request.data['processId']
        data_name = request.data['dataName']
        content = request.data['content']
        data_path = request.data['data_path']
        
        process = Process.objects.create(email=email, process_id=process_id, 
            data_name=data_name, content=content, data_path=data_path)
        
        data = {
            'code': 'upload',
            'message': '上传Process数据成功'
        }

        Loggings.objects.create(status=2, describe='email:{0},message:{1}'.format(email,data['message']))
        return Response(data)

# ExperiData.objects.all().delete()
class UploadRankView(APIView):
    '''
    修改rank
    '''
    def post(self, request, *args, **kwargs):
        try:
            id = request.data['id']
            print(id)
            rank = request.data['rank']
            experi = Experi.objects.get(id=id)
            experi.rank = rank
            experi.save()
            
            data = {
                'code': 'info',
                'message': '成功设置rank'
            }

            Loggings.objects.create(status=2, describe='id:{0},message:{1}'.format(id,data['message']))
            return Response(data)
        except:
            token=request.META.get("HTTP_TOKEN")
            decode = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            email = decode['email']

            type = changeType(request.data['dataType'])
            data_name = request.data['dataName']
            rank = request.data['rank']
            
            experi = Experi.objects.get(email=email, type=type, data_name=data_name)
            experi.rank = rank
            experi.save()
            
            data = {
                'code': 'info',
                'message': '成功设置rank'
            }

            Loggings.objects.create(status=2, describe='email:{0},message:{1}'.format(email,data['message']))
            return Response(data)

class UpdatePublicView(APIView):
    '''
    修改public
    '''
    def post(self, request, *args, **kwargs):
        id = request.data['id']
        isPublic = request.data['isPublic']
        
        experi = Experi.objects.get(id=id)
        experi.isPublic = isPublic
        experi.save()
        
        data = {
            'code': 'info',
            'message': '成功设置public'
        }

        Loggings.objects.create(status=2, describe='id:{0},message:{1}'.format(id,data['message']))
        return Response(data)

class DeleteView(APIView):
    '''
    逻辑删除
    '''
    def post(self, request, *args, **kwargs):
        id = request.data['id']
        
        experi = Experi.objects.get(id=id)
        experi.is_delete = True
        experi.save()
        
        data = {
            'code': 'info',
            'message': '成功删除'
        }

        Loggings.objects.create(status=2, describe='id:{0},message:{1}'.format(id,data['message']))
        return Response(data)

class GetResponseDataView(APIView):
    '''
    获取数据库实验数据
    '''
    def post(self, request, *args, **kwargs):
        token=request.META.get("HTTP_TOKEN")
        decode = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        email = decode['email']
        is_superAdmin = decode['is_superAdmin']

        dataType = request.data['dataType']
        sqlData = cache.get('sqlData_' + email + dataType)
        if sqlData: return Response(sqlData)

        type = changeType(dataType)
        if is_superAdmin:
            expris = Experi.objects.filter(type=type, is_delete=False)
            responses = self.getResponse(expris)

            data = {
                'code': 'data',
                'responses': responses
            }
            cache.set('sqlData_' + email + dataType, data, 3600)
            Loggings.objects.create(status=2, describe='email:{0},message:获取数据库实验数据'.format(email))
            return Response(data)
        else:
            isManage = decode['is_manage']
            if isManage:
                expris = Experi.objects.filter(type=type, is_delete=False)
                responses = self.getResponse(expris)

                data = {
                    'code': 'data',
                    'responses': responses
                }

                cache.set('sqlData_' + email + dataType, data, 3600)
                Loggings.objects.create(status=2, describe='email:{0},message:获取数据库实验数据'.format(email))
                return Response(data)
            else:
                responses = []
                expris = Experi.objects.filter(email=email, type=type, is_delete=False)
                responses.extend(self.getResponse(expris))
                expris_ = Experi.objects.filter(type=type, isPublic=True, is_delete=False).exclude(email=email).all()
                responses.extend(self.getResponse(expris_))

                data = {
                    'code': 'data',
                    'responses': responses
                }
                cache.set('sqlData_' + email + dataType, data, 3600)
                Loggings.objects.create(status=2, describe='email:{0},message:获取数据库实验数据'.format(email))
                return Response(data)

    def getResponse(self, expris):
        responses = []
        for expri in expris:
            response = {
                'id': expri.id,
                'email': expri.email,
                # 时间
                'time': expri.time,
                # 工艺号,样品号,等级
                'processId': expri.process_id,
                'sampleId': expri.sample_id,
                'rank': expri.rank,
                # 附加信息:名称,图片,工艺文件
                'dataName': expri.data_name,
                # 'content': expri.content,
                'file': self.getFile(expri.email, expri.process_id),
                # 是否公开显示
                'isPublic': expri.isPublic,
            }
            content = json.loads(expri.content)
            result = {**response, **content}
            
            responses.append(result)
        return responses

    def getFile(self, email, process_id):
        file =  Process.objects.filter(email=email, process_id=process_id)
        if len(file) == 0:
            return False
        
        return file.content

class GetMyResponseDataView(APIView):
    '''
    获取个人数据库实验数据
    '''
    def post(self, request, *args, **kwargs):
        email = request.data['email']
        dataType = request.data['dataType']
        sqlmyData = cache.get('sqlmyData_' + email + dataType)
        if sqlmyData: return Response(sqlmyData)

        type = changeType(dataType)
        responses = []
        expris = Experi.objects.filter(email=email, type=type, is_delete=False)
        responses.extend(self.getResponse(expris))

        data = {
            'code': 'data',
            'responses': responses
        }
        cache.set('sqlmyData_' + email + dataType, data, 3600)
        Loggings.objects.create(status=2, describe='email:{0},message:获取个人数据库实验数据'.format(email))
        return Response(data)

    def getResponse(self, expris):
        responses = []
        for expri in expris:
            response = {
                'id': expri.id,
                'email': expri.email,
                # 时间
                'time': expri.time,
                # 工艺号,样品号,等级
                'processId': expri.process_id,
                'sampleId': expri.sample_id,
                'rank': expri.rank,
                # 附加信息:名称,图片,工艺文件
                'dataName': expri.data_name,
                # 'content': expri.content,
                'file': self.getFile(expri.email, expri.process_id),
                # 是否公开显示
                'isPublic': expri.isPublic,
            }
            content = json.loads(expri.content)
            result = {**response, **content}
            
            responses.append(result)
        return responses

    def getFile(self, email, process_id):
        file =  Process.objects.filter(email=email, process_id=process_id)
        if len(file) == 0:
            return False
        
        return file.content


class GetWeekDataView(APIView):
    '''
    获取周数据
    '''
    def post(self, request, *args, **kwargs):
        email = request.data['email']
        week = request.data['week']

        # weekExp = cache.get('weekExp_' + email + 'week_' + str(week))
        # if weekExp: return Response(weekExp)

        now = timezone.now().date()
        start_date = now - datetime.timedelta(days=now.weekday()+7*week)
        end_date = start_date + datetime.timedelta(days=7)
        experis = Experi.objects.filter(email=email,time__gte=start_date,time__lt=end_date)
        

        experiWeekNumber = [0, 0, 0, 0, 0]
        for experi in experis:
            experiWeekNumber[experi.type] += 1
        
        data = {
            'code': 'get',
            'experiWeekNumber': experiWeekNumber,
            'start_date': start_date,
            'end_date': end_date
        }

        cache.set('weekExp_' + email + 'week_' + str(week), data, 3600)
        Loggings.objects.create(status=2, describe='email:{0},message:获取周数据'.format(email))
        return Response(data)

class GetMonthDataView(APIView):
    '''
    获取月数据
    '''
    def post(self, request, *args, **kwargs):
        email = request.data['email']
        month = request.data['month']

        # monthExp = cache.get('monthExp_' + email + 'month_' + str(month))
        # if monthExp: return Response(monthExp)

        now = timezone.now().date()
        start_date = now.replace(day=1) - relativedelta(months=month)
        end_date = start_date + relativedelta(months=month+1)
        experis = Experi.objects.filter(email=email,time__gte=start_date,time__lt=end_date)
        
        experiMonthNumber = [0, 0, 0, 0, 0]
        for experi in experis:
            experiMonthNumber[experi.type] += 1
        
        data = {
            'code': 'get',
            'experiMonthNumber': experiMonthNumber,
            'start_date': start_date,
            'end_date': end_date
        }

        cache.set('monthExp_' + email + 'month_' + str(month), data, 3600)
        Loggings.objects.create(status=2, describe='email:{0},message:获取月数据'.format(email))
        return Response(data)

class GetYearDataView(APIView):
    '''
    获取年数据
    '''
    def post(self, request, *args, **kwargs):
        email = request.data['email']
        year = request.data['year']

        # yearExp = cache.get('yearExp_' + email + 'year_' + str(year))
        # if yearExp: return Response(yearExp)

        now = timezone.now().date()
        start_date = now.replace(month=1, day=1, year=now.year-year)
        end_date = now.replace(month=12, day=31, year=now.year-year)
        experis = Experi.objects.filter(email=email,time__gte=start_date,time__lt=end_date)
        
        experiYearNumber = [0, 0, 0, 0, 0]
        for experi in experis:
            experiYearNumber[experi.type] += 1
        
        data = {
            'code': 'get',
            'experiYearNumber': experiYearNumber,
            'start_date': start_date,
            'end_date': end_date
        }

        cache.set('yearExp_' + email + 'year_' + str(year), data, 3600)
        Loggings.objects.create(status=2, describe='email:{0},message:获取年数据'.format(email))
        return Response(data)



