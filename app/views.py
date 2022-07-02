from os import stat
from this import d
from time import time
from types import NoneType
from urllib import response
from django.shortcuts import render
from rest_framework.parsers import JSONParser
from .serializers import ActivitySerializer, CompletedBountySerializer, CouponSerializer, ProfileSerializer, BountySerializer, WorkSubmissionSerializer, TransactionSerializer
from django.http.response import JsonResponse
from .models import Activity, Coupon, Profile, Bounty, WorkSubmission, Transaction, CompletedBounty
from rest_framework import status
from rest_framework.decorators import api_view
import os

@api_view(['GET', 'POST'])
def profiles(request):
    if request.method == 'GET':
        profiles = Profile.objects.all()
        profile_serializer = ProfileSerializer(profiles, many=True)
        return JsonResponse(profile_serializer.data, safe=False)
    elif request.method == 'POST':
        profile_data = JSONParser().parse(request)
        profile_serializer = ProfileSerializer(data=profile_data)
        if profile_serializer.is_valid():
            profile_serializer.save()
            return JsonResponse(profile_serializer.data, status=status.HTTP_201_CREATED)
        return JsonResponse(profile_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    return JsonResponse([], safe=False)


@api_view(['GET', 'PATCH', 'DELETE'])
def profile(request, address):
    profile = Profile.objects.filter(wallet_address=address).first()
    if profile is None:
        profile = Profile.objects.get(id=address)
    if request.method == 'GET':
        if profile is None:
            return JsonResponse(None, safe=False)
        profile_serializer = ProfileSerializer(profile)
        return JsonResponse(profile_serializer.data, safe=False)
    if request.method == 'PATCH':
        profile_serializer = ProfileSerializer(
            profile, data=request.data['profile'], partial=True)
        if profile_serializer.is_valid():
            profile_serializer.save()
            return JsonResponse(profile_serializer.data, status=status.HTTP_200_OK)
        return JsonResponse(profile_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@ api_view(['GET', 'POST'])
def bounties(request):
    if request.method == 'GET':
        bounty_creator = request.GET.get('bounty_creator')
        bounty_owner = request.GET.get('bounty_owner')
        if bounty_creator is not None:
            bounties = Bounty.objects.filter(bounty_creator=bounty_creator).order_by('-id')

            bounty_serializer = BountySerializer(bounties, many=True)
            return JsonResponse(bounty_serializer.data, safe=False)
        if bounty_owner is not None:
            # bounty_owner_wallet is an array so needing to see if it contains
            # owner
            bounties = Bounty.objects.filter(
                bounty_owner_wallet__contains=[bounty_owner]).order_by('-id')
            bounty_serializer = BountySerializer(bounties, many=True)
            return JsonResponse(bounty_serializer.data, safe=False)

        # Home page for bounties
        bounties = Bounty.objects.filter().order_by('-id')
        # bounties = Bounty.objects.all()
        bounty_serializer = BountySerializer(bounties, many=True)
        return JsonResponse(bounty_serializer.data, safe=False)
    elif request.method == 'POST':
        bounty_data = JSONParser().parse(request)
        bounty = bounty_data['bounty']
        bounty_serializer = BountySerializer(data=bounty)
        if bounty_serializer.is_valid():
            bounty_serializer.save()
            bounty_validated = bounty_serializer.validated_data
            profile = Profile.objects.filter(
                wallet_address=bounty_validated['bounty_creator']).first()
            activity_object = {
                'bounty': bounty_serializer.data['id'], 'profile': profile.id, 'activity_type': 'Bounty Created'}
            activity_serializer = ActivitySerializer(data=activity_object)
            if activity_serializer.is_valid():
                activity_serializer.save()
                print(activity_serializer.data)
            print(activity_serializer.errors)
            return JsonResponse(bounty_serializer.data, status=status.HTTP_201_CREATED)
        print(bounty_serializer.errors)
        return JsonResponse(bounty_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    return JsonResponse([], safe=False)


@ api_view(['GET', 'PATCH', 'DELETE'])
def bounty(request, bounty_id):
    bounty = Bounty.objects.get(id=bounty_id)
    if request.method == 'GET':
        bounty_serializer = BountySerializer(bounty)
        return JsonResponse(bounty_serializer.data, safe=False)
    elif request.method == 'PATCH':
        bounty_serializer = BountySerializer(
            bounty, data=request.data['bounty'], partial=True)
        if bounty_serializer.is_valid():
            bounty_serializer.save()
            if 'activities' in request.data:
                activity = request.data['activities']
                profile = Profile.objects.filter(
                    wallet_address=activity['wallet_address']).first()
                _create_activity_object(activity, profile.id)
            return JsonResponse(bounty_serializer.data, status=status.HTTP_200_OK)
        print(bounty_serializer.errors)
        return JsonResponse(bounty_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@ api_view(['GET', 'POST'])
def activities(request):
    if request.method == 'GET':
        bounty_id = request.GET.get('bounty_id')
        # For activities in Bounties
        if bounty_id is not None:
            activities = Activity.objects.filter(bounty=bounty_id).order_by('-created_at')
            activity_serializer = ActivitySerializer(activities, many=True)
            return JsonResponse(activity_serializer.data, safe=False)
        activities = Activity.objects.all()
        activity_serializer = ActivitySerializer(activities, many=True)
        return JsonResponse(activity_serializer.data, safe=False)
    elif request.method == 'POST':
        activity_data = JSONParser().parse(request)
        activity = activity_data['activities']
        profile = Profile.objects.filter(
            wallet_address=activity['wallet_address']).first()
        activity.update({'profile': profile.id})
        activity_serializer = ActivitySerializer(data=activity)
        if activity_serializer.is_valid():
            activity_serializer.save()
            return JsonResponse(activity_serializer.data, status=status.HTTP_201_CREATED)
        print(activity_serializer.errors)
        return JsonResponse(activity_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@ api_view(['GET', 'POST'])
def work_submissions(request):
    if request.method == 'GET':
        bounty_id = request.GET.get('bounty_id')
        # For submissions in Bounties
        if bounty_id is not None:
            # choosing submissions if open or archived
            open_submissions = False if request.GET.get(
                'open') == 'null' else True
            work_submissions = WorkSubmission.objects.filter(
                bounty=bounty_id, open=open_submissions)
            work_submissions_serializer = WorkSubmissionSerializer(
                work_submissions, many=True)
            return JsonResponse(work_submissions_serializer.data, safe=False)
        work_submissions = WorkSubmission.objects.all()
        work_submissions_serializer = WorkSubmissionSerializer(
            work_submissions, many=True)
        return JsonResponse(work_submissions_serializer.data, safe=False)
    elif request.method == 'POST':
        data = JSONParser().parse(request)
        work_submission = data['work_submission']
        profile = Profile.objects.filter(
            wallet_address=work_submission['wallet_address']).first()
        work_submission.update({'profile': profile.id})
        work_submission_serializer = WorkSubmissionSerializer(
            data=work_submission)
        if work_submission_serializer.is_valid():
            work_submission_serializer.save()
            _create_activity_object(data['activities'], profile.id)
            return JsonResponse(work_submission_serializer.data, status=status.HTTP_201_CREATED)
        print(work_submission_serializer.errors)
        return JsonResponse(work_submission_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@ api_view(['GET', 'PATCH', 'DELETE'])
def work_submission(request, work_submission_id):
    work_submission = WorkSubmission.objects.get(id=work_submission_id)
    if request.method == 'GET':
        work_submission_serializer = WorkSubmissionSerializer(work_submission)
        return JsonResponse(work_submission_serializer.data, safe=False)
    if request.method == 'PATCH':
        work_submission_serializer = WorkSubmissionSerializer(
            work_submission, data=request.data['work_submission'], partial=True)
        if work_submission_serializer.is_valid():
            work_submission_serializer.save()
            return JsonResponse(work_submission_serializer.data, status=status.HTTP_200_OK)


@api_view(['GET', 'POST'])
def coupons(request):
    if request.method == 'GET':
        coupons = Coupon.objects.all()
        coupons_serializer = CouponSerializer(data=coupons, many=True)
        if coupons_serializer.is_valid():
            return JsonResponse(coupons_serializer.data)
        return JsonResponse([])
    if request.method == 'POST':
        data = JSONParser().parse(request)
        coupon = data['coupon']
        coupon_serializer = CouponSerializer(data=coupon)
        if coupon_serializer.is_valid():
            return JsonResponse(coupon_serializer.data, status=status.HTTP_200_OK)
        return JsonResponse(coupon_serializer.data, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PATCH'])
def coupon(request, code):
    coupon = Coupon.objects.filter(code=code).first()
    if request.method == 'GET':
        if coupon:
            coupon_serializer = CouponSerializer(coupon)
            if coupon_serializer.data['active'] == True:
                return JsonResponse(coupon_serializer.data, safe=False)
        return JsonResponse(None, safe=False)
    if request.method == 'PATCH':
        coupon_serializer = CouponSerializer(
            coupon, request.data['coupon'], partial=True)
        if coupon_serializer.is_valid():
            coupon_serializer.save()
            return JsonResponse(coupon_serializer.data, status=status.HTTP_200_OK)
        return JsonResponse(coupon_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@ api_view(['GET', 'POST'])
def transactions(request):
    if request.method == 'GET':
        transactions = Transaction.objects.all()
        transactions_serializer = TransactionSerializer(
            data=transactions, many=True)
        if transactions_serializer.is_valid():
            return JsonResponse(transactions_serializer.data, safe=False)
    elif request.method == 'POST':
        data = JSONParser().parse(request)
        transaction = data['transaction']
        transaction_serializer = TransactionSerializer(data=transaction)
        if transaction_serializer.is_valid():
            transaction_serializer.save()
            return JsonResponse(transaction_serializer.data, status=status.HTTP_201_CREATED)
        return JsonResponse(transaction_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@ api_view(['GET', 'POST'])
def completed_bounties(request):
    if request.method == 'GET':
        bounty_id = request.GET.get('bounty_id')
        if bounty_id is not None: 
            completed_bounties = CompletedBounty.objects.filter(bounty=bounty_id)
            completed_bounties_serializer = CompletedBountySerializer(completed_bounties, many=True)
        else:
            completed_bounties = CompletedBounty.objects.all() 
            completed_bounties_serializer = CompletedBountySerializer(completed_bounties, many=True)
        return JsonResponse(completed_bounties_serializer.data, safe=False)
        
    if request.method == 'POST':
        data = JSONParser().parse(request)
        completed_bounty = data['completed_bounty']
        completed_bounty_serializer = CompletedBountySerializer(data=completed_bounty)
        if completed_bounty_serializer.is_valid():
            completed_bounty_serializer.save() 
            return JsonResponse(completed_bounty_serializer.data, status=status.HTTP_201_CREATED)
        return JsonResponse(completed_bounty_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Helpers
def _create_activity_object(activity, profile_id):
    activity.update({'profile': profile_id})
    activity_serializer = ActivitySerializer(data=activity)
    if activity_serializer.is_valid():
        activity_serializer.save()
        return JsonResponse(activity_serializer.data, status=status.HTTP_201_CREATED)
    return JsonResponse(activity_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
