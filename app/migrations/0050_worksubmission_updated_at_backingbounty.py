# Generated by Django 4.0.5 on 2022-07-09 18:57

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0049_remove_transactionintoescrow_bounty_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='worksubmission',
            name='updated_at',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.CreateModel(
            name='BackingBounty',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('wallet_address', models.CharField(max_length=255)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('bounty', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='app.bounty')),
            ],
        ),
    ]