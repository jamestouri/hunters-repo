import stripe
import os


def create_payment_account(fund_info):
    stripe.api_key = 'sk_test_51LLchqAFvevI7J9Px3hWuPqYnMLgXNdQNDU5Nu0o7MWjQCjMlakIdIWAYTw3R5S28XehX5GfNBr5C6Vzcf5Df0zq00cBO6Ldpf'

    stripe.client_id = 'ca_M405zEqANdkCzmOmcRQKGbd78bvX55qq'

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
    print(account)
    return stripe.AccountLink.create(
        account=account['id'],
        refresh_url='http://localhost:3000/',
        return_url='http://localhost:3000/organization/' +
        fund_info['org'] + '/bounty/' + fund_info['bounty'] + '/',
        type="account_onboarding",
    )
