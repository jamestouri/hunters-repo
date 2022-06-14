from django.shortcuts import render
from rest_framework.parsers import JSONParser
from .serializers import ProfileSerializer, BountySerializer
from django.http.response import JsonResponse
from .models import Profile, Bounty
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
        print(bounty_data)
        bounty = bounty_data['bounty']
        bounty_serializer = BountySerializer(data=bounty)
        if bounty_serializer.is_valid():
            bounty_serializer.save()
            return JsonResponse(bounty_serializer.data, status=status.HTTP_201_CREATED)
        print(bounty_serializer.errors)
        return JsonResponse(bounty_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    return JsonResponse([])
