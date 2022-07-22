# Generated by Django 4.0.5 on 2022-07-13 05:10

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0054_organization_wallet_address'),
    ]

    operations = [
        migrations.CreateModel(
            name='OrganizationMembers',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('wallet_address', models.CharField(max_length=255)),
                ('profile_picture', models.CharField(blank=True, max_length=255, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('organization', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app.organization')),
            ],
        ),
        migrations.RemoveField(
            model_name='funderrating',
            name='rating_creator',
        ),
        migrations.RemoveField(
            model_name='funderrating',
            name='rating_receiver',
        ),
        migrations.RemoveField(
            model_name='organizatinmembers',
            name='organization',
        ),
        migrations.RemoveField(
            model_name='bounty',
            name='other_owners',
        ),
        migrations.RemoveField(
            model_name='transactionintoescrow',
            name='amount_eth',
        ),
        migrations.AddField(
            model_name='backingbounty',
            name='profile',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='app.profile'),
        ),
        migrations.AddField(
            model_name='bounty',
            name='profile',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='app.profile'),
        ),
        migrations.AddField(
            model_name='profile',
            name='user_id',
            field=models.CharField(max_length=255, null=True, unique=True),
        ),
        migrations.AddField(
            model_name='transactionintoescrow',
            name='profile',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='app.profile'),
        ),
        migrations.AlterField(
            model_name='profile',
            name='wallet_address',
            field=models.CharField(db_index=True, max_length=255, null=True, unique=True),
        ),
        migrations.AlterField(
            model_name='worksubmission',
            name='profile',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='app.profile'),
        ),
        migrations.DeleteModel(
            name='CompletedBounty',
        ),
        migrations.DeleteModel(
            name='FunderRating',
        ),
        migrations.DeleteModel(
            name='OrganizatinMembers',
        ),
    ]