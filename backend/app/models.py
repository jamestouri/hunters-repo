from pyexpat import model
from statistics import mode
from django.db import models
from django.contrib.postgres.fields import ArrayField, JSONField

# Create your models here.


class Profile(models.Model):
    wallet_address = models.CharField(max_length=255, unique=True, blank=False)
    # Eventually add scores and other ways of building out a profile
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Bounty(models.Model):
    PERMISSION_TYPES = [
        ('permissionless', 'permissionless'),
        ('approval', 'approval'),
    ]
    REPO_TYPES = [
        ('public', 'public')
    ]
    PROJECT_TYPES = [
        ('traditional', 'traditional')
    ]
    BOUNTY_CATEGORIES = [
        ('frontend', 'frontend'),
        ('backend', 'backend'),
        ('design', 'design'),
        ('documentation', 'documentation'),
        ('other', 'other'),
        ('react', 'react'),
        ('solidity', 'solidity'),
        ('javascript', 'javascript'),
    ]
    BOUNTY_TYPES = [
        ('Bug', 'Bug'),
        ('Project', 'Project'),
        ('Feature', 'Feature'),
        ('Security', 'Security'),
        ('Improvement', 'Improvement'),
        ('Design', 'Design'),
        ('Docs', 'Docs'),
        ('Code review', 'Code review'),
        ('Other', 'Other'),
    ]
    EXPERIENCE_LEVELS = [
        ('Beginner', 'Beginner'),
        ('Intermediate', 'Intermediate'),
        ('Advanced', 'Advanced'),
    ]
    PROJECT_LENGTHS = [
        ('Hours', 'Hours'),
        ('Days', 'Days'),
        ('Weeks', 'Weeks'),
        ('Months', 'Months'),
    ]

    STATUS = [
        ('cancelled', 'cancelled'),
        ('done', 'done'),
        ('expired', 'expired'),
        ('reserved', 'reserved'),
        ('open', 'open'),
        ('started', 'started'),
        ('submitted', 'submitted'),
    ]

    STATE = [
        ('open', 'Open Bounty'),
        ('work_started', 'Work Started'),
        ('work_submitted', 'Work Submitted'),
        ('done', 'Done'),
        ('cancelled', 'Cancelled'),
        ('expired', 'Expired'),
    ]

    state = models.CharField(max_length=50, choices=STATE,
                             default='open', db_index=True)
    title = models.CharField(max_length=1000)
    description = models.TextField(default='', blank=True)
    funding_organization = models.CharField(
        max_length=255, default='', blank=True)
    organization_url = models.CharField(
        max_length=255, default='', blank=True)
    attached_job_url = models.URLField(blank=True, null=True, db_index=True)
    ways_to_contact = models.CharField(max_length=255, default='', blank=True)
    image_attachments = ArrayField(models.CharField(
        max_length=255), blank=True, default=list)
    # Shouldn't be null=True, but we should keep the Bounty if user is deleted
    bounty_creator = models.CharField(max_length=255, db_index=True, null=True)
    is_featured = models.BooleanField(
        default=False, help_text='Whether this bounty is featured')
    other_owners = models.ManyToManyField(Profile, blank=True, default=None)
    bounty_type = models.CharField(
        max_length=50, choices=BOUNTY_TYPES, blank=True, db_index=True)
    project_length = models.CharField(
        max_length=50, choices=PROJECT_LENGTHS, blank=True, db_index=True)
    bounty_category = ArrayField(models.CharField(
        max_length=50, choices=BOUNTY_CATEGORIES), default=list, blank=True)
    bounty_owner_wallet = models.CharField(
        max_length=255, db_index=True, blank=True, null=True)
    bounty_value_in_eth = models.DecimalField(
        max_digits=50,
        decimal_places=10,
        help_text="The amount in eth users bounty creators want to pay out for the bounty")
    bounty_value_in_usd = models.DecimalField(
        max_digits=100,
        decimal_places=2,
        help_text="The amount in usd users bounty creators want to pay out for the bounty")
    # Added in Views.py
    repo_type = models.CharField(
        max_length=10, choices=REPO_TYPES, default='public')
    # Added in Views.py
    permission_type = models.CharField(
        max_length=50, choices=PERMISSION_TYPES, default='permissionless', db_index=True)
    # Added in Views.py
    project_type = models.CharField(
        max_length=50, choices=PROJECT_TYPES, default='traditional', db_index=True)
    # Added in Views.py
    status = models.CharField(max_length=50, choices=STATUS,
                              default='open', db_index=True)
    # Added in Views.py
    experience_level = models.CharField(
        max_length=50, choices=EXPERIENCE_LEVELS, blank=True, db_index=True, default='beginner')
    accepted = models.BooleanField(
        default=False, help_text='Whether the bounty has been done')
    canceled_on = models.DateTimeField(null=True, blank=True)
    canceled_bounty_reason = models.TextField(
        default='', blank=True, verbose_name='Cancelation reason', null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
