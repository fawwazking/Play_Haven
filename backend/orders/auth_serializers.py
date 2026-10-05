from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate

class UserSerializer(serializers.ModelSerializer):
    role = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_staff', 'is_superuser', 'role']

    def get_role(self, obj):
        if obj.is_staff or obj.is_superuser:
            return "admin"
        return "customer"

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    confirm_password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name', 'password', 'confirm_password']

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({"password": "Password dan konfirmasi password tidak cocok."})
        
        email = data.get('email')
        if email and User.objects.filter(email=email).exists():
            raise serializers.ValidationError({"email": "Email ini sudah terdaftar."})

        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            password=validated_data['password'],
            is_staff=False,
            is_superuser=False
        )
        return user

class LoginSerializer(serializers.Serializer):
    username_or_email = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        identifier = data.get('username_or_email', '').strip()
        password = data.get('password', '')

        user = None
        # Check by email first
        if '@' in identifier:
            try:
                user_obj = User.objects.get(email=identifier)
                user = authenticate(username=user_obj.username, password=password)
            except User.DoesNotExist:
                user = None
        
        if not user:
            user = authenticate(username=identifier, password=password)

        if not user:
            raise serializers.ValidationError("Username / Email atau Password salah.")

        if not user.is_active:
            raise serializers.ValidationError("Akun ini dinonaktifkan.")

        data['user'] = user
        return data
