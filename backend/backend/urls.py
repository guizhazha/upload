"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.views.static import serve
from django.conf import settings

urlpatterns = [
    # path('admin/', admin.site.urls),
    path('static/<path:path>', serve, {'document_root': settings.STATIC_ROOT},),  # 处理静态文件
    path('media/<path:path>', serve, {'document_root': settings.MEDIA_ROOT}, ),  # 处理媒体文件

    #管理后台的标准接口
    path('api/v1/user/', include('apps.user.urls')),
    path('api/v1/data/', include('apps.data.urls')),
    path('api/v1/message/', include('apps.message.urls')),
    path('api/v1/loggings/', include('apps.loggings.urls')),
]
