from atexit import register
from django.contrib import admin
from .models import (
    Activity,
    Profile,
    Bounty,
    WorkSubmission,
    FunderRating,
    Coupon,
    Transaction,
    CompletedBounty,
    Organization,
    OrganizatinMembers
)

# Register your models here.


class ProfileAdmin(admin.ModelAdmin):
    profile_display = ('wallet_address', 'created_at')


admin.site.register(Profile, ProfileAdmin)


class BountyAdmin(admin.ModelAdmin):
    bounty_display = (
        'id',
        'title',
        'funding_orgnanization',
        'organization',
        'ways_to_contact',
        'bounty_creator',
        'is_featured',
        'bounty_value_in_eth',
        'bounty_value_in_usd',
        'state'
    )


admin.site.register(Bounty, BountyAdmin)


class ActivityAdmin(admin.ModelAdmin):
    activity_display = (
        'id',
        'bounty',
        'profile',
        'activity_type',
    )


admin.site.register(Activity, ActivityAdmin)


class WorkSubmissionAdmin(admin.ModelAdmin):
    work_submission_display = (
        'id',
        'bounty',
        'profile',
        'project_link',
        'additional_text',
        'email',
        'open',
        'accepted',
        'created_at'
    )


admin.site.register(WorkSubmission, WorkSubmissionAdmin)


class FunderRatingAdmin(admin.ModelAdmin):
    funder_rating_admin = (
        'id',
        'star_rating',
        'rating_creator',
        'rating_receiver',
        'created_at',
    )


admin.site.register(FunderRating, FunderRatingAdmin)


class CouponAdmin(admin.ModelAdmin):
    coupon_admin = (
        'id',
        'code',
        'discount_amount',
        'active',
        'created_at',
    )


admin.site.register(Coupon, CouponAdmin)


class TransactionAdmin(admin.ModelAdmin):
    transaction_admin = (
        'id',
        'txn_hash',
        'sender_wallet_address',
        'receiver_wallet_address',
        'amount_usd',
        'amount_eth',
        'txn_type',
        'bounty',
    )


admin.site.register(Transaction, TransactionAdmin)


class CompletedBountyAdmin(admin.ModelAdmin):
    completed_bounty_admin = (
        'id',
        'bounty',
        'profile_wallet',
        'created_at'
    )


admin.site.register(CompletedBounty, CompletedBountyAdmin)


class OrganizationAdmin(admin.ModelAdmin):
    org_admin = (
        'id',
        'bounty',
        'created_at'
        'profile_picture',
        'organization_profile_picture_inital',
        'organization_id',

    )


admin.site.register(Organization, OrganizationAdmin)


class OrganizationMembersAdmin(admin.ModelAdmin):
    member_admin = (
        'wallet_address',
        'organization',
    )
admin.site.register(OrganizatinMembers, OrganizationMembersAdmin)
