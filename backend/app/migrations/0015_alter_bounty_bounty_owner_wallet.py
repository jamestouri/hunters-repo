# Generated by Django 4.0.5 on 2022-06-15 16:00

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0014_alter_bounty_bounty_owner_wallet'),
    ]

    operations = [
        migrations.AlterField(
            model_name='bounty',
            name='bounty_owner_wallet',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=255), blank=True, null=True, size=None),
        ),
    ]