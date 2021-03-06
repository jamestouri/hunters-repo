# Generated by Django 4.0.5 on 2022-06-27 19:27

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0039_coupon'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='bounty',
            name='bounty_value_in_eth',
        ),
        migrations.CreateModel(
            name='Transaction',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('txn_hash', models.CharField(max_length=255, unique=True)),
                ('sender_wallet_address', models.CharField(max_length=255)),
                ('receiver_wallet_address', models.CharField(max_length=255)),
                ('amount_usd', models.DecimalField(decimal_places=2, max_digits=100)),
                ('amount_eth', models.DecimalField(decimal_places=10, max_digits=50)),
                ('txn_type', models.CharField(choices=[('Bounty Creation', 'Bounty Creation'), ('Bounty Payout', 'Bounty Payout')], max_length=100)),
                ('bounty', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app.bounty')),
            ],
        ),
    ]
