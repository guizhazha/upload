from django.urls import path
from .views import CheckExperiNameView, UploadExperiView,UploadProgressView, \
    UploadRankView,UpdatePublicView,DeleteView,GetResponseDataView,GetMyResponseDataView,\
    GetWeekDataView,GetMonthDataView,GetYearDataView

urlpatterns = [
    path('checkExperiName/', CheckExperiNameView.as_view()),
    path('uploadExperi/', UploadExperiView.as_view()),
    path('uploadProgress/', UploadProgressView.as_view()),
    path('updateRank/', UploadRankView.as_view()),
    path('updatePublic/', UpdatePublicView.as_view()),
    path('delete/', DeleteView.as_view()),
    path('getResponseData/', GetResponseDataView.as_view()),
    path('getMyResponseData/', GetMyResponseDataView.as_view()),

    # 获取周数据
    path('getWeekData/', GetWeekDataView.as_view()),
    # 获取月数据
    path('getMonthData/', GetMonthDataView.as_view()),
    # 获取年数据
    path('getYearData/', GetYearDataView.as_view()),
]