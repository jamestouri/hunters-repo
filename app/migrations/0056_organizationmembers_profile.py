# Generated by Django 4.0.5 on 2022-07-13 05:19

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0055_organizationmembers_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='organizationmembers',
            name='profile',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='app.profile'),
        ),
    ]