# Generated by Django 4.0.5 on 2022-06-26 22:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0037_profile_profile_picture_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='activity',
            name='activity_type',
            field=models.CharField(choices=[('Bounty Created', 'Bounty Created'), ('Started Work', 'Started Work'), ('Work Submitted', 'Work Submitted'), ('Work Approved', 'Work Approved'), ('Funds Paid Out', 'Funds Paid Out'), ('Left Project', 'Left Project'), ('Edited Bounty', 'Edited Bounty')], max_length=100),
        ),
        migrations.AlterField(
            model_name='bounty',
            name='experience_level',
            field=models.CharField(blank=True, choices=[('Beginner', 'Beginner'), ('Intermediate', 'Intermediate'), ('Advanced', 'Advanced')], db_index=True, default='Beginner', max_length=50),
        ),
    ]
