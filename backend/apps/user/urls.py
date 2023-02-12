from django.urls import path
from .views import GetCodeView, RegisterView, LoginView,\
    ForgetPasswordView,GetPasswordView,\
    GetUserInfoView,SetInfoView,\
    GetMyStudentsView,AddStudentView,GetAllStudentsView,\
    GetNumberView,GetInfosView,GetAllView
    

urlpatterns = [
    # 获得验证码
    path('getCode/', GetCodeView.as_view()),
    # 注册
    path('register/', RegisterView.as_view()),
    # 登录 | 获得token
    path('token/', LoginView.as_view()),
    # 忘记密码
    path('forgetPassword/', ForgetPasswordView.as_view()),
    # 获取密码
    path('getPassword/', GetPasswordView.as_view()),
    # 获取个人信息
    path('getUserInfo/', GetUserInfoView.as_view()),
    # 设置个人信息
    path('setInfo/', SetInfoView.as_view()),
    # 获得我的学生
    path('getMyStudents/', GetMyStudentsView.as_view()),
    # 获得全体成员
    path('getAll/', GetAllView.as_view()),
    # 添加我的学生
    path('addStudent/', AddStudentView.as_view()),

    # 获得全部学生
    path('getAllStudents/', GetAllStudentsView.as_view()),
    # 统计人数和数据
    path('getNumber/', GetNumberView.as_view()),
    # 人员信息
    path('getInfos/', GetInfosView.as_view()),
]