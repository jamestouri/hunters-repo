"""hunters URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
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
from django.urls import path
from django.urls import re_path as url
from app import views
from django.views.generic import TemplateView


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/profiles/', views.profiles),
    path('api/profile/<address>/', views.profile),
    url(r'^api/activities/?', views.activities),
    path('api/bounties/', views.bounties),
    url(r'^api/bounties/?', views.bounties),
    path('api/bounty/<bounty_id>/', views.bounty),
    path('api/activities/', views.activities),
    path('api/work_submissions/', views.work_submissions),
    url(r'^api/work_submissions/?', views.work_submissions),
    path('api/work_submission/<work_submission_id>/', views.work_submission),
    path('api/transactions/', views.transactions),
    path('api/coupons/', views.coupons),
    path('api/coupon/<code>/', views.coupon),
    path('api/organizations/', views.organizations),
    path('api/organization/<org_id>/', views.organization),
    path('api/organization_members/', views.organization_members),
    url(r'^api/organization_members/?', views.organization_members),
    path('api/transactions_into_escrow/', views.transactions_into_escrow),
    path('api/backing_bounties/', views.backing_bounties),
    url(r'^api/backing_bounties/?', views.backing_bounties),
    path('api/fund_bounties/', views.fund_bounties),
    url(r'^api/fund_bounty/?', views.fund_bounty),
]
