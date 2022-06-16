# Generated by Django 4.0.5 on 2022-06-15 22:32

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0027_alter_funderrating_rating_creator_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='funderrating',
            name='star_rating',
            field=models.PositiveSmallIntegerField(default=0, validators=[django.core.validators.MinValueValidator(0), django.core.validators.MaxValueValidator(5)]),
        ),
    ]
