from rest_framework.views import APIView
from rest_framework.response import Response

import jwt
from django.conf import settings

from django.core.cache import cache
from message.models import Message, Notion
from loggings.models import Loggings

# Create your views here.
class GetNotionView(APIView):
    '''
    获得最近三个通知
    '''
    def post(self, request, *args, **kwargs):
        three_notions = cache.get('three_notions')
        if three_notions: return Response(three_notions)
        
        latest_three = Notion.objects.order_by('-time')[:3]
        responses = []
        if not len(latest_three) == 0:
            for notion in latest_three:
                response = {
                    'id': notion.id,
                    'content': notion.content,
                    'time': notion.time,
                }
                responses.append(response)

        data = {
            'code': 'get',
            'responses': responses
        }

        cache.set('three_notions', data, 3600)
        Loggings.objects.create(status=2, describe='message:获得最近三个通知')
        return Response(data)


class GetMessageView(APIView):
    '''
    获得发送给本人的未读信息
    '''
    def post(self, request, *args, **kwargs):
        token=request.META.get("HTTP_TOKEN")
        decode = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        email = decode['email']

        self_messages = cache.get('self_messages_' + email)
        if self_messages: return Response(self_messages)
        
        messages = Message.objects.filter(to_id=email, is_read=False).order_by('-time')
        responses = []
        if not len(messages) == 0:
            for mes in messages:
                response = {
                    'id': mes.id,
                    'send_id': mes.send_id,
                    'content': mes.content,
                    'time': mes.time,
                }
                responses.append(response)

        data = {
            'code': 'get',
            'responses': responses
        }

        cache.set('self_messages_' + email, data, 3600)
        Loggings.objects.create(status=2, describe='email:{0},message:{1}'.format(email,'获得发送给本人的未读信息'))
        return Response(data)

class GetAllNotionView(APIView):
    '''
    获得全部通知
    '''
    def post(self, request, *args, **kwargs):
        all_notions = cache.get('all_notions')
        if all_notions: return Response(all_notions)
        
        notions = Notion.objects.order_by('-time')
        responses = []
        if not len(notions) == 0:
            for notion in notions:
                response = {
                    'id': notion.id,
                    'content': notion.content,
                    'time': notion.time,
                }
                responses.append(response)

        data = {
            'code': 'get',
            'responses': responses
        }

        cache.set('all_notions', data, 3600)
        Loggings.objects.create(status=2, describe='message:获得全部通知')
        return Response(data)


class GetMyMessageView(APIView):
    '''
    获得发送给本人的全部信息
    '''
    def post(self, request, *args, **kwargs):
        token=request.META.get("HTTP_TOKEN")
        decode = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        email = decode['email']

        my_all_messages = cache.get('my_all_messages_' + email)
        if my_all_messages: return Response(my_all_messages)
        
        messages = Message.objects.filter(to_id=email).order_by('-time')
        responses = []
        if not len(messages) == 0:
            for mes in messages:
                response = {
                    'id': mes.id,
                    'send_id': mes.send_id,
                    'content': mes.content,
                    'is_read': mes.is_read,
                    'time': mes.time,
                }
                responses.append(response)

        data = {
            'code': 'get',
            'responses': responses
        }

        cache.set('my_all_messages_' + email, data, 3600)
        Loggings.objects.create(status=2, describe='email:{0},message:{1}'.format(email,'获得发送给本人的未读信息'))
        return Response(data)


class SendMessageView(APIView):
    '''
    发送给别人的短信
    '''
    def post(self, request, *args, **kwargs):
        token=request.META.get("HTTP_TOKEN")
        decode = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        send_id = decode['email']
        
        to_id = request.data['to_id']
        content = request.data['content']
        Message.objects.create(send_id=send_id, to_id=to_id, content=content)

        data = {
            'message': '成功向{}发送短信'.format(to_id),
            'code': 'info'
        }

        Loggings.objects.create(status=2, describe='email:{0},message:{1}'.format(send_id,data['message']))
        return Response(data)

class SendNotionView(APIView):
    '''
    发布通知
    '''
    def post(self, request, *args, **kwargs):
        content = request.data['content']
        Notion.objects.create(content=content)

        data = {
            'message': '成功发布通知',
            'code': 'info'
        }

        Loggings.objects.create(status=2, describe='message:{1}'.format(data['message']))
        return Response(data)

class ReadMessageView(APIView):
    '''
    消息已读
    '''
    def post(self, request, *args, **kwargs):
        id = request.data['id']

        message = Message.objects.get(id=id)
        message.is_read = True
        message.save()

        data = {
            'message': '消息已读',
            'code': 'read'
        }

        Loggings.objects.create(status=2, describe='message:{1}'.format(data['message']))
        return Response(data)
