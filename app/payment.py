from django.http import JsonResponse
import stripe
import os
from .serializers import FundingTransactionSerializer
from .models import FundingTransaction, Profile
from rest_framework import status
from dotenv import load_dotenv

load_dotenv()

stripe.api_key = os.environ.get('API_KEY')
stripe.client_id = os.environ.get('CLIENT_KEY')

def create_payment_account(fund_info):
    account = stripe.Account.create(
        country="US",
        type="express",
        capabilities={
            "card_payments": {"requested": True},
            "transfers": {"requested": True},
        },
        business_type="individual",
        email=fund_info['email'],
        settings={"payouts": {"schedule": {"interval": "manual"}}},
    )
    return account


def account_link_generator(fund_info):
    account_id = fund_info['account_id']
    return stripe.AccountLink.create(
        account=account_id,
        refresh_url='http://localhost:3000/',
        return_url='http://localhost:3000/organization/' +
        str(fund_info['org']) + '/',
        type="account_onboarding",
    )


def check_details(account_id):
    account = stripe.Account.retrieve(account_id)
    return account['details_submitted']

# Charge


def fund_a_bounty(charge_info):
    amount = int(charge_info['amount']) * 100
    account_id = charge_info['account_id']
    bounty_id = charge_info['bounty_id']
    org = charge_info['org']

    session = stripe.checkout.Session.create(
        line_items=[{
            'name': 'Funding Via Unwall',
            'amount': amount,
            'currency': 'usd',
            'quantity': 1,
        }],
        payment_intent_data={
            'application_fee_amount': int(amount * 0.075),
            'transfer_data': {
                'destination': account_id,
            },
        },
        mode='payment',
        success_url='http://localhost:3000/organization/' +
        str(org) + '/bounty/' + str(bounty_id) + '/',
        cancel_url='http://localhost:3000/organization/' +
        str(org) + '/',
    )
    return session


def get_checkout_session(payload):
    endpoint_secret = os.environ.get('WEBHOOK_ENDPOINT_KEY')
    try:
        event = stripe.Event.construct_from(
            payload, endpoint_secret
        )
    except ValueError as e:
        # Invalid payload
        raise e
    except stripe.error.SignatureVerificationError as e:
        # Invalid signature
        raise e
    # Handle the event
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        _set_funding_transaction(session=session)
    else:
        print('Unhandled event type {}'.format(event['type']))


def _set_funding_transaction(session):
    email = session['customer_details']['email']
    profile = Profile.objects.filter(email=email).first()

    amount = session['amount_total']
    paid_out = True if session['payment_status'] == 'paid' else False
    success_url = session['success_url']
    url_split = success_url.split('/')

    # Hacky way to figure out the bounty and organization
    # bounty = int(url_split[-2])
    # org = url_split[-4]

    txn = {'profile': profile.id, 'amount': amount,
           'bounty': 68, 'organization': 20, 'paid_out': paid_out}

    txn_serializer = FundingTransactionSerializer(data=txn)
    if txn_serializer.is_valid():
        txn_serializer.save()
        return JsonResponse(txn_serializer.data, status=status.HTTP_201_CREATED)
    return JsonResponse(txn_serializer.errors, status=status.HTTP_400_BAD_REQUEST)