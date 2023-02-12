from django.urls import path
from .views import GetNotionView, GetMessageView,\
    GetAllNotionView, GetMyMessageView,\
    SendMessageView, SendNotionView,\
    ReadMessageView

urlpatterns = [
    # 获取最近三条通知和未读消息
    path('getNotion/', GetNotionView.as_view()),
    path('getMessage/', GetMessageView.as_view()),

    # 获取全部通知和个人全部信息
    path('getAllNotionView/', GetAllNotionView.as_view()),
    path('getMyMessage/', GetMyMessageView.as_view()),

    # 发送消息
    path('sendMessage/', SendMessageView.as_view()),
    # 发送通知
    path('sendNotion/', SendNotionView.as_view()),

    # 已读消息
    path('readMessage/', ReadMessageView.as_view()),
]