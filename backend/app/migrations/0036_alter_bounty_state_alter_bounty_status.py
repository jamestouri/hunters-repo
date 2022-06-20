# Generated by Django 4.0.5 on 2022-06-20 23:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0035_alter_profile_profile_picture'),
    ]

    operations = [
        migrations.AlterField(
            model_name='bounty',
            name='state',
            field=models.CharField(choices=[('open', 'Open Bounty'), ('done', 'Done'), ('cancelled', 'Cancelled'), ('expired', 'Expired')], db_index=True, default='open', max_length=50),
        ),
        migrations.AlterField(
            model_name='bounty',
            name='status',
            field=models.CharField(choices=[('cancelled', 'cancelled'), ('done', 'done'), ('expired', 'expired'), ('reserved', 'reserved'), ('open', 'open')], db_index=True, default='open', max_length=50),
        ),
    ]