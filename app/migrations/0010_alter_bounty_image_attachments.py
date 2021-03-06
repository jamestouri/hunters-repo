# Generated by Django 4.0.5 on 2022-06-14 15:51

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0009_alter_bounty_image_attachments'),
    ]

    operations = [
        migrations.AlterField(
            model_name='bounty',
            name='image_attachments',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=255), blank=True, default=list, size=None),
        ),
    ]
