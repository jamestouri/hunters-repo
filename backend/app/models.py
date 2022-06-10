from django.db import models

# Create your models here.

class Profile(models.Model):
    wallet_address = models.CharField(max_length=255, unique=True, blank=False)
    # Eventually add scores and other ways of building out a profile

    