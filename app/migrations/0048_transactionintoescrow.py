# Generated by Django 4.0.5 on 2022-07-08 22:43

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0047_rename_organization_profile_picture_inital_organization_organization_profile_picture_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='TransactionIntoEscrow',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('txn_hash', models.CharField(default=None, max_length=255, null=True, unique=True)),
                ('wallet_address', models.CharField(max_length=255)),
                ('amount_usd', models.DecimalField(decimal_places=2, max_digits=100)),
                ('amount_eth', models.DecimalField(decimal_places=10, max_digits=50)),
                ('description', models.TextField(blank=True, default='')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('bounty', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='app.bounty')),
            ],
        ),
    ]
