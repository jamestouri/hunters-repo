# Generated by Django 4.0.5 on 2022-06-15 16:15

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0020_remove_bounty_bounty_owner_wallet'),
    ]

    operations = [
        migrations.RenameField(
            model_name='bounty',
            old_name='bounty_owner_wallets',
            new_name='bounty_owner_wallet',
        ),
    ]
