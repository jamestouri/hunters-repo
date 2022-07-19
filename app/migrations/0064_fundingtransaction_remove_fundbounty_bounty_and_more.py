# Generated by Django 4.0.5 on 2022-07-19 05:31

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0063_stripeaccount_account_creator_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='FundingTransaction',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('amount', models.DecimalField(decimal_places=2, max_digits=100)),
                ('paid_out', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('bounty', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='app.bounty')),
                ('organization', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app.organization')),
                ('profile', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='app.profile')),
            ],
        ),
        migrations.RemoveField(
            model_name='fundbounty',
            name='bounty',
        ),
        migrations.RemoveField(
            model_name='fundbounty',
            name='transaction_into_escrow',
        ),
        migrations.RemoveField(
            model_name='transaction',
            name='bounty',
        ),
        migrations.RemoveField(
            model_name='transactionintoescrow',
            name='profile',
        ),
        migrations.DeleteModel(
            name='BackingBounty',
        ),
        migrations.DeleteModel(
            name='FundBounty',
        ),
        migrations.DeleteModel(
            name='Transaction',
        ),
        migrations.DeleteModel(
            name='TransactionIntoEscrow',
        ),
    ]
