# Generated by Django 4.0.5 on 2022-06-28 03:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0041_alter_transaction_txn_hash'),
    ]

    operations = [
        migrations.AlterField(
            model_name='bounty',
            name='attached_job_url',
            field=models.CharField(blank=True, db_index=True, max_length=255, null=True),
        ),
    ]