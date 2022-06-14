from statistics import mode
from rest_framework import serializers
from .models import Profile, Bounty


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ('id', 'wallet_address')


class BountySerializer(serializers.ModelSerializer):
    class Meta:
        model = Bounty
        fields = '__all__'