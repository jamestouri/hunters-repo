from pyexpat import model
from statistics import mode
from rest_framework import serializers
from .models import (
    Profile,
    Bounty,
    Activity,
    WorkSubmission,
    Coupon,
    Organization,
    OrganizationMembers,
    StripeAccount,
    FundingTransaction
)


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = '__all__'


class BountySerializer(serializers.ModelSerializer):
    class Meta:
        model = Bounty
        fields = '__all__'


class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = '__all__'


class WorkSubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkSubmission
        fields = '__all__'


class CouponSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coupon
        fields = '__all__'

class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = '__all__'


class OrganizationMembersSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrganizationMembers
        fields = '__all__'

class FundingTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = FundingTransaction
        fields = '__all__'


class StripeAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = StripeAccount
        fields = '__all__'
