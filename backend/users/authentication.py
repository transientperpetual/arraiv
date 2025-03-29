from rest_framework_simplejwt.authentication import JWTAuthentication
from django.conf import settings

class CookieJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        try:
            header = self.get_header(request)

            if header is None:
                raw_token = request.COOKIES.get('arraiv_at')
                print("raw_token cookie", raw_token)
            else:
                raw_token = self.get_raw_token(header)
                print("raw_token header", raw_token)
            
            
            if raw_token is None:
                return None 
            
            validated_token = self.get_validated_token(raw_token)

            return self.get_user(validated_token), validated_token
        except:
            return None
