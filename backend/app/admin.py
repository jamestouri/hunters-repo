from django.contrib import admin
from .models import Profile

# Register your models here.

class ProfileAdmin(admin.ModelAdmin):
    profile_display = ('wallet_address')

admin.site.register(Profile, ProfileAdmin)