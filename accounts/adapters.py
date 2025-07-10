from allauth.account.adapter import DefaultAccountAdapter

class NoSignupAccountAdapter(DefaultAccountAdapter):
    def is_open_for_signup(self, request):
        """
        Disable user registration. Only admin can create users.
        """
        return False