using ECommerce.API.DTOs.Requests;
using ECommerce.API.DTOs.Responses;

namespace ECommerce.API.Services.Interfaces;

public interface IAuthService
{
    Task<AuthResponse> RegisterAsync(RegisterRequest request);

    Task<AuthResponse> LoginAsync(LoginRequest request);

    Task ForgotPasswordAsync(string email);

    Task VerifyOtpAsync(
        string email,
        string otp);

    Task ResetPasswordAsync(
        string email,
        string otp,
        string newPassword);
}