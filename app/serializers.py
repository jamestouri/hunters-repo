from statistics import mode
from rest_framework import serializers
from .models import (
    Profile,
    Bounty,
    Activity,
    WorkSubmission,
    Coupon,
    Transaction,
    Organization,
    OrganizationMembers,
    TransactionIntoEscrow,
    FundBounty,
    BackingBounty
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


class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = '__all__'

class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = '__all__'

class OrganizationMembersSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrganizationMembers
        fields = '__all__'    

class TransactionIntoEscrowSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransactionIntoEscrow
        fields = '__all__'


class BackingBountySerializer(serializers.ModelSerializer):
    class Meta:
        model = BackingBounty 
        fields = '__all__'

class FundBountySerializer(serializers.ModelSerializer):
    class Meta:
        model = FundBounty 
        fields = '__all__'
