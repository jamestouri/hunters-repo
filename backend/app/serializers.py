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
        fields = (
            'id',
            'state',
            'title',
            'description',
            'funding_organization',
            'organization_url',
            'attached_job_url',
            'ways_to_contact',
            'image_attachments',
            'bounty_creator',
            'is_featured',
            'other_owners',
            'bounty_type',
            'project_length',
            'bounty_category',
            'bounty_owner_profile',
            'bounty_value_in_eth',
            'bounty_value_in_usd',
            'repo_type',
            'permission_type',
            'project_type',
            'attached_job_description',
            'status',
            'experience_level',
            'accepted',
            'canceled_on',
            'canceled_bounty_reason'
        )
