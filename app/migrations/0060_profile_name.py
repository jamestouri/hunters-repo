# Generated by Django 4.0.5 on 2022-07-13 16:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0059_remove_profile_profile_picture_initial_profile_email_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='name',
            field=models.CharField(default='none', max_length=255),
            preserve_default=False,
        ),
    ]
