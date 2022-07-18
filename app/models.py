from pyexpat import model
from statistics import mode
from django.db import models
from django.contrib.postgres.fields import ArrayField, JSONField
from django.core.validators import MaxValueValidator, MinValueValidator

# Create your models here.


class Profile(models.Model):
    wallet_address = models.CharField(
        max_length=255, unique=True, blank=False, db_index=True, null=True)
    name = models.CharField(max_length=255)
    # slowly transition to Auth0 user sub
    user_id = models.CharField(max_length=255, unique=True, null=True)
    profile_picture = models.CharField(max_length=255, blank=True, null=True)
    email = models.CharField(max_length=255, unique=True, null=True)
    nickname = models.CharField(max_length=255, unique=True, null=True)
    # Eventually add scores and other ways of building out a profile
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Organization(models.Model):
    name = models.CharField(max_length=255)
    # Creating a random color as profile picture until changed
    organization_profile_picture_initial = models.CharField(
        max_length=20, default='#fb1c48')
    profile_picture = models.CharField(max_length=255, blank=True, null=True)
    organization_url = models.CharField(
        max_length=255, default='', blank=True)
    organization_id = models.CharField(
        max_length=255, unique=True, db_index=True)
    wallet_address = models.CharField(max_length=255, blank=True, null=True)
    external_url_of_requests = models.CharField(
        max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class OrganizationMembers(models.Model):
    # DEPRECATE
    wallet_address = models.CharField(max_length=255, null=True, blank=True)
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE)
    # DEPRECATE
    profile_picture = models.CharField(max_length=255, blank=True, null=True)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
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
        ('Feature Request', 'Feature Request'),
        ('Security', 'Security'),
        ('Improvement', 'Improvement'),
        ('Design', 'Design'),
        ('Docs', 'Docs'),
        ('Code review', 'Code review'),
        ('Good first issue', 'Good first issue'),
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
    ]

    STATE = [
        ('open', 'Open Bounty'),
        ('done', 'Done'),
        ('cancelled', 'Cancelled'),
        ('expired', 'Expired'),
    ]

    state = models.CharField(max_length=50, choices=STATE,
                             default='open', db_index=True)
    title = models.CharField(max_length=1000)
    description = models.TextField(default='', blank=True)
    # Deprecating and making it backwards compatible
    funding_organization = models.CharField(
        max_length=255, default='', blank=True)
    organization_url = models.CharField(
        max_length=255, default='', blank=True)
    # Deprecating and making it backwards compatible
    organization = models.ForeignKey(
        Organization, on_delete=models.CASCADE, null=True, default=None)
    attached_job_url = models.CharField(
        max_length=255, blank=True, null=True, db_index=True)
    ways_to_contact = models.CharField(max_length=255, default='', blank=True)
    image_attachments = ArrayField(models.CharField(
        max_length=255), blank=True, default=list)
    # Shouldn't be null=True, but we should keep the Bounty if user is deleted
    # Want to keep things as much web3 as possible and therefore make it specifically
    # the wallet Address to identify users creating the bounty rather than
    # the Profile

    # DEPRECATE
    bounty_creator = models.CharField(max_length=255, db_index=True, null=True)
    is_featured = models.BooleanField(
        default=False, help_text='Whether this bounty is featured')
    bounty_type = models.CharField(
        max_length=50, choices=BOUNTY_TYPES, blank=True, db_index=True, null=True)
    project_length = models.CharField(
        max_length=50, choices=PROJECT_LENGTHS, blank=True, db_index=True, null=True)
    bounty_category = ArrayField(models.CharField(
        max_length=50, choices=BOUNTY_CATEGORIES), default=list, blank=True)

    creator_profile = models.ForeignKey(
        Profile, on_delete=models.SET_NULL, null=True)
    bounty_owner_wallet = ArrayField(models.CharField(
        max_length=255), blank=True, default=list)
    bounty_value_in_usd = models.DecimalField(
        max_digits=100,
        decimal_places=2,
        help_text="The amount in usd users bounty creators want to pay out for the bounty", null=True)
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
        max_length=50, choices=EXPERIENCE_LEVELS, blank=True, db_index=True, default='Beginner')
    accepted = models.BooleanField(
        default=False, help_text='Whether the bounty has been done')
    canceled_on = models.DateTimeField(null=True, blank=True)
    canceled_bounty_reason = models.TextField(
        default='', blank=True, verbose_name='Cancelation reason', null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Activity(models.Model):

    ACTIVITY_TYPE = (
        ('Bounty Created', 'Bounty Created'),
        ('Started Work', 'Started Work'),
        ('Work Submitted', 'Work Submitted'),
        ('Work Approved', 'Work Approved'),
        ('Funds Paid Out', 'Funds Paid Out'),
        ('Left Project', 'Left Project'),
        ('Edited Bounty', 'Edited Bounty'),
    )

    bounty = models.ForeignKey(Bounty, on_delete=models.CASCADE)
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE)
    activity_type = models.CharField(max_length=100, choices=ACTIVITY_TYPE)
    created_at = models.DateTimeField(auto_now_add=True)


class WorkSubmission(models.Model):
    bounty = models.ForeignKey(Bounty, on_delete=models.CASCADE)
    profile = models.ForeignKey(Profile, on_delete=models.SET_NULL, null=True)
    submission_header = models.CharField(max_length=255, default='')
    project_link = models.CharField(max_length=255, blank=True, default='')
    additional_text = models.TextField(default='', blank=True)
    email = models.CharField(max_length=255, default='')
    open = models.BooleanField(
        default=True, help_text='For organizing when looking at submissions')
    accepted = models.BooleanField(
        default=False, help_text='If false and rejected is false, submission has not been reviewed yet')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Coupon(models.Model):
    code = models.CharField(max_length=50, unique=True, db_index=True)
    discount_amount = models.IntegerField(
        validators=[MinValueValidator(0), MaxValueValidator(100)])
    active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.code


# DEPRECATE
class Transaction(models.Model):
    TXN_TYPE = (
        ('Bounty Creation', 'Bounty Creation'),
        ('Bounty Payout', 'Bounty Payout')
    )
    txn_hash = models.CharField(
        max_length=255, unique=True, null=True, default=None)
    sender_wallet_address = models.CharField(max_length=255)
    receiver_wallet_address = models.CharField(max_length=255)
    amount_usd = models.DecimalField(max_digits=100, decimal_places=2)
    amount_eth = models.DecimalField(max_digits=50, decimal_places=10)
    txn_type = models.CharField(max_length=100, choices=TXN_TYPE)
    bounty = models.ForeignKey(Bounty, on_delete=models.CASCADE)


class TransactionIntoEscrow(models.Model):
    txn_hash = models.CharField(
        max_length=255, unique=True, null=True, default=None)
    wallet_address = models.CharField(max_length=255)
    # Transition to the profile Object
    profile = models.ForeignKey(Profile, on_delete=models.SET_NULL, null=True)
    amount_usd = models.DecimalField(max_digits=100, decimal_places=2)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)


class FundBounty(models.Model):
    bounty = models.ForeignKey(
        Bounty, on_delete=models.SET_NULL, db_index=True, null=True)
    transaction_into_escrow = models.ForeignKey(
        TransactionIntoEscrow, on_delete=models.CASCADE, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)


class BackingBounty(models.Model):
    bounty = models.ForeignKey(
        Bounty, on_delete=models.SET_NULL, db_index=True, null=True)
    # Transition to the profile Object
    profile = models.ForeignKey(Profile, on_delete=models.SET_NULL, null=True)
    wallet_address = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)


class StripeAccount(models.Model):
    organization = models.ForeignKey(
        Organization, on_delete=models.CASCADE, db_index=True)
    account_creator = models.ForeignKey(Profile, on_delete=models.CASCADE)
    stripe_account_id = models.CharField(max_length=255, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
