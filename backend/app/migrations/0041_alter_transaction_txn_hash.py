# Generated by Django 4.0.5 on 2022-06-27 20:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0040_remove_bounty_bounty_value_in_eth_transaction'),
    ]

    operations = [
        migrations.AlterField(
            model_name='transaction',
            name='txn_hash',
            field=models.CharField(default=None, max_length=255, null=True, unique=True),
        ),
    ]
