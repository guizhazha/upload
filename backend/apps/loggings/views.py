from rest_framework.views import APIView
from rest_framework.response import Response

import jwt
from django.conf import settings

from django.core.cache import cache
from message.models import Message
from loggings.models import Loggings

# Create your views here.
class OnlineView(APIView):
    '''
    获得通知
    '''
    def post(self, request, *args, **kwargs):
        describe = request.data['describe']
        # print('describe', describe)
        Loggings.objects.create(status=4, describe=describe)
        return Response('')