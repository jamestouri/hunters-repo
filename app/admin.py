from atexit import register
from django.contrib import admin
from .models import (
    Activity,
    Profile,
    Bounty,
    WorkSubmission,
    Coupon,
    FundingTransaction,
    Organization,
    OrganizationMembers,
    StripeAccount,
)

# Register your models here.


class ProfileAdmin(admin.ModelAdmin):
    profile_display = (
        'wallet_address',
        'name',
        'created_at', 
        'user_id',
        'profile_picture',
        'email',
        'nickname',
        )


admin.site.register(Profile, ProfileAdmin)


class BountyAdmin(admin.ModelAdmin):
    bounty_display = (
        'id',
        'title',
        'funding_orgnanization',
        'organization',
        'ways_to_contact',
        'profile',
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


class CouponAdmin(admin.ModelAdmin):
    coupon_admin = (
        'id',
        'code',
        'discount_amount',
        'active',
        'created_at',
    )


admin.site.register(Coupon, CouponAdmin)


class FundingTransactionAdmin(admin.ModelAdmin):
    transaction_admin = (
        'id',
        'profile',
        'amount',
        'bounty',
        'organization',
        'paid_out',
    )


admin.site.register(FundingTransaction, FundingTransactionAdmin)


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
        'profile',
        'organization',
    )


admin.site.register(OrganizationMembers, OrganizationMembersAdmin)


class StripeAccountAdmin(admin.ModelAdmin):
    stripe_account_admin = (
        'organization',
        'account_creator',
        'stripe_account_id',
    )

admin.site.register(StripeAccount, StripeAccountAdmin)