namespace ECommerce.API.Stripe;

public class StripeSettings
{
    public string SecretKey { get; set; }
        = string.Empty;

    public string SuccessUrl { get; set; }
        = string.Empty;

    public string CancelUrl { get; set; }
        = string.Empty;
}