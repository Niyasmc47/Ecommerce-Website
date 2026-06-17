using System.Text.Json;
using ECommerce.API.Services.Interfaces;

namespace ECommerce.API.Services.Implementations;

public class TurnstileService
    : ITurnstileService
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<TurnstileService> _logger;

    public TurnstileService(
        HttpClient httpClient,
        ILogger<TurnstileService> logger)
    {
        _httpClient = httpClient;
        _logger = logger;
    }

    public async Task<bool> VerifyAsync(
        string token)
    {
        if (string.IsNullOrWhiteSpace(token))
        {
            _logger.LogWarning(
                "Turnstile token is null or empty.");
            return false;
        }

        var secret =
            Environment.GetEnvironmentVariable(
                "TURNSTILE_SECRET_KEY");

        if (string.IsNullOrWhiteSpace(secret))
        {
            _logger.LogWarning(
                "TURNSTILE_SECRET_KEY environment variable is not set. Skipping CAPTCHA verification.");
            return false;
        }

        var response =
            await _httpClient.PostAsync(
                "https://challenges.cloudflare.com/turnstile/v0/siteverify",
                new FormUrlEncodedContent(
                    new Dictionary<string, string>
                    {
                        { "secret", secret },
                        { "response", token }
                    }));

        var json =
            await response.Content
                .ReadAsStringAsync();

        using var document =
            JsonDocument.Parse(json);

        return document
            .RootElement
            .GetProperty("success")
            .GetBoolean();
    }
}