# Generated by Django 4.0.5 on 2022-06-18 20:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0032_remove_worksubmission_archived_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='profile_picture',
            field=models.CharField(blank=True, max_length=255),
        ),
    ]
