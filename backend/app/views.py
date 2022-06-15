from django.shortcuts import render
from rest_framework.parsers import JSONParser
from .serializers import ActivitySerializer, ProfileSerializer, BountySerializer
from django.http.response import JsonResponse
from .models import Activity, Profile, Bounty
from rest_framework import status
from rest_framework.decorators import api_view


@api_view(['GET', 'POST'])
def profiles(request):
    print(request)
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
    return JsonResponse([])


@api_view(['GET', 'PUT', 'DELETE'])
def profile(request, address):
    profile = Profile.objects.filter(wallet_address=address).first()
    if request.method == 'GET':
        if profile is None:
            return JsonResponse(None, safe=False)
        profile_serializer = ProfileSerializer(profile)
        return JsonResponse(profile_serializer.data, safe=False)


@api_view(['GET', 'POST'])
def bounties(request):
    if request.method == 'GET':
        bounties = Bounty.objects.all()
        bounty_serializer = BountySerializer(bounties, many=True)
        return JsonResponse(bounty_serializer.data, safe=False)
    elif request.method == 'POST':
        bounty_data = JSONParser().parse(request)
        bounty = bounty_data['bounty']
        bounty_serializer = BountySerializer(data=bounty)
        if bounty_serializer.is_valid():
            bounty_serializer.save()
            return JsonResponse(bounty_serializer.data, status=status.HTTP_201_CREATED)
        print(bounty_serializer.errors)
        return JsonResponse(bounty_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    return JsonResponse([])


@api_view(['GET', 'PUT', 'DELETE'])
def bounty(request, bounty_id):
    bounty = Bounty.objects.get(id=bounty_id)
    if request.method == 'GET':
        bounty_serializer = BountySerializer(bounty)
        return JsonResponse(bounty_serializer.data, safe=False)
    elif request.method == 'PATCH':
        bounty_serializer = BountySerializer(bounty, data=request.data)
        if bounty_serializer.is_valid():
            bounty_serializer.save()
            return JsonResponse(bounty_serializer.data, status=status.HTTP_200_OK)
        print(bounty_serializer.errors)
        return JsonResponse(bounty_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def activities(request):
    if request.method == 'GET':
        activities = Activity.objects.all() 
        activity_serializer = ActivitySerializer(activities, many=True)
        return JsonResponse(activity_serializer.data, safe=False)
    elif request.method == 'POST':
        activity_data = JSONParser().parse(request)
        activity = activity_data['activity']
        bounty = Bounty.objects.get(id=activity.bounty_id)
        profile = Profile.objects.filter(wallet_address=activity.wallet_address).first()
        activity.update({bounty: bounty, profile: profile})
        activity_serializer = ActivitySerializer(data=activity)
        if activity_serializer.is_valid():
            activity_serializer.save()
            return JsonResponse(activity_serializer.data, status=status.HTTP_201_CREATED)
        print(activity_serializer.errors)
        return JsonResponse(activity_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

