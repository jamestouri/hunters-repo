# Generated by Django 4.0.5 on 2022-07-13 14:56

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0056_organizationmembers_profile'),
    ]

    operations = [
        migrations.RenameField(
            model_name='bounty',
            old_name='profile',
            new_name='creator_profile',
        ),
    ]