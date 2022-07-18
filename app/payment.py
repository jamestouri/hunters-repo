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
    )
    return account


def create_account_link(fund_info):
    return stripe.AccountLink.create(
        account=fund_info['account_id'],
        refresh_url='http://localhost:3000/',
        return_url='http://localhost:3000/organization/' +
        fund_info['org'] + '/',
        type="account_onboarding",
    )


def check_if_details_submitted(account_id):
    account = stripe.Account.retrieve(account_id)
    return account['details_submitted']
