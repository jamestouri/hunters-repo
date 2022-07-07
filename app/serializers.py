from statistics import mode
from rest_framework import serializers
from .models import (
    Organization,
    Profile,
    Bounty,
    Activity,
    WorkSubmission,
    FunderRating,
    Coupon,
    Transaction,
    CompletedBounty,
    Organization,
    OrganizatinMembers,
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


class FunderRatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = FunderRating
        fields = '__all__'


class CouponSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coupon
        fields = '__all__'


class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = '__all__'


class CompletedBountySerializer(serializers.ModelSerializer):
    class Meta:
        model = CompletedBounty
        fields = '__all__'


class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = '__all__'

class OrganizationMembersSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrganizatinMembers
        fields = '__all__'    