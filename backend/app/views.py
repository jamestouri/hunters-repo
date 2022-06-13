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
        bounty = request.POST.copy()
        bounty.update({'repo_type': 'public', 'permission_type': 'permissioness',
                      'project_type': 'traditional', 'status': 'open', 'experience_level': 'beginner'})
        bounty_data = JSONParser().parse(request)
        bounty_serializer = BountySerializer(data=bounty_data)
        if bounty_serializer.is_valid():
            bounty_serializer.save()
            return JsonResponse(bounty_serializer.data, status=status.HTTP_201_CREATED)
        return JsonResponse(bounty_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    return JsonResponse([])
