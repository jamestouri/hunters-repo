# Generated by Django 4.0.5 on 2022-07-13 16:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0058_alter_organizationmembers_profile_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='profile',
            name='profile_picture_initial',
        ),
        migrations.AddField(
            model_name='profile',
            name='email',
            field=models.CharField(max_length=255, null=True, unique=True),
        ),
        migrations.AddField(
            model_name='profile',
            name='nickname',
            field=models.CharField(max_length=255, null=True, unique=True),
        ),
    ]