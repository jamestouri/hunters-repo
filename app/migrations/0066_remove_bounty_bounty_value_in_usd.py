# Generated by Django 4.0.5 on 2022-07-22 14:29

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0065_remove_bounty_bounty_creator'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='bounty',
            name='bounty_value_in_usd',
        ),
    ]
