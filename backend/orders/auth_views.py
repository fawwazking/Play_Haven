from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from .auth_serializers import UserSerializer, RegisterSerializer, LoginSerializer

class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                "message": "Registrasi berhasil! Silakan login.",
                "user": UserSerializer(user).data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            user_data = UserSerializer(user).data
            return Response({
                "message": f"Selamat datang kembali, {user.first_name or user.username}!",
                "user": user_data
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ProfileView(APIView):
    def get(self, request):
        username = request.query_params.get('username')
        if not username:
            return Response({"error": "Parameter username diperlukan"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            user = User.objects.get(username=username)
            return Response(UserSerializer(user).data, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "User tidak ditemukan"}, status=status.HTTP_404_NOT_FOUND)
