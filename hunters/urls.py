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
    path('api/funding_transactions/', views.funding_transactions),
    path('api/coupons/', views.coupons),
    path('api/coupon/<code>/', views.coupon),
    path('api/organizations/', views.organizations),
    path('api/organization/<org_id>/', views.organization),
    path('api/organization_members/', views.organization_members),
    url(r'^api/organization_members/?', views.organization_members),
    path('api/create_account_link/', views.create_account_link),
    path('api/stripe_accounts/', views.stripe_accounts),
    path('api/stripe_account/<org_id>/', views.stripe_account),
    path('api/check_if_details_submitted/<account_id>/',
         views.check_if_details_submitted),
    path('api/start_destination_charge/', views.start_destination_charge),
    path('v1/webhook_completed_checkout/', views.completed_checkout)
]
