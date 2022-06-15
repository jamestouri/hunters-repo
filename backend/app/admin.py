from django.contrib import admin
from .models import Activity, Profile, Bounty

# Register your models here.


class ProfileAdmin(admin.ModelAdmin):
    profile_display = ('wallet_address')


admin.site.register(Profile, ProfileAdmin)


class BountyAdmin(admin.ModelAdmin):
    bounty_display = (
        'id',
        'title',
        'funding_orgnanization',
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
