import stripe
import os

stripe.api_key = 'sk_test_51LLchqAFvevI7J9Px3hWuPqYnMLgXNdQNDU5Nu0o7MWjQCjMlakIdIWAYTw3R5S28XehX5GfNBr5C6Vzcf5Df0zq00cBO6Ldpf'
stripe.client_id = 'ca_M405zEqANdkCzmOmcRQKGbd78bvX55qq'


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
    print(session)
    print('✅')
    return session

def get_checkout_session(session_id):
    'cs_test_a1nPTOWmP9HkqGINtXKZWSf5YuHawnhcHewDrHyTa5MF7LwI7MLhUD9xFB'