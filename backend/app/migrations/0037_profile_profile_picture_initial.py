# Generated by Django 4.0.5 on 2022-06-21 05:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0036_alter_bounty_state_alter_bounty_status'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='profile_picture_initial',
            field=models.CharField(default='#1DB3F9', max_length=20),
        ),
    ]