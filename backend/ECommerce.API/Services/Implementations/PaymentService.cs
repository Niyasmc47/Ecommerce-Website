using ECommerce.API.Data;
using ECommerce.API.DTOs.Requests;
using ECommerce.API.DTOs.Responses;
using ECommerce.API.Models;
using ECommerce.API.Services.Interfaces;
using ECommerce.API.Stripe;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Stripe.Checkout;
using ECommerce.API.Email;

namespace ECommerce.API.Services.Implementations;

public class PaymentService : IPaymentService
{
    private readonly ApplicationDbContext _context;
    private readonly IOrderService _orderService;
    private readonly IEmailService _emailService;
    private readonly StripeSettings _stripeSettings;

    public PaymentService(
        ApplicationDbContext context,
        IOrderService orderService,
        IEmailService emailService,
        IOptions<StripeSettings> stripeOptions)
    {
        _context = context;
        _orderService = orderService;
        _emailService = emailService;
        _stripeSettings = stripeOptions.Value;

        global::Stripe.StripeConfiguration.ApiKey =
    _stripeSettings.SecretKey;
    }

    public async Task<CheckoutSessionResponse>
    CreateCheckoutSessionAsync(
        int userId,
        CheckoutRequest request)
    {
        var cartItems = await _context.CartItems
            .Where(x => x.UserId == userId)
            .ToListAsync();

        if (!cartItems.Any())
        {
            throw new Exception("Cart is empty.");
        }

        var lineItems =
            new List<SessionLineItemOptions>();

        decimal totalAmount = 0;

        foreach (var cartItem in cartItems)
        {
            var product =
                await _context.Products
                    .FirstOrDefaultAsync(
                        x => x.Id ==
                        cartItem.ProductId);

            if (product is null)
                continue;

            totalAmount +=
                product.Price *
                cartItem.Quantity;

            lineItems.Add(
                new SessionLineItemOptions
                {
                    Quantity =
                        cartItem.Quantity,

                    PriceData =
                        new SessionLineItemPriceDataOptions
                        {
                            Currency = "inr",

                            UnitAmount =
                                (long)(product.Price * 100),

                            ProductData =
                                new SessionLineItemPriceDataProductDataOptions
                                {
                                    Name =
                                        product.Name
                                }
                        }
                });
        }

        var options =
            new SessionCreateOptions
            {
                Mode = "payment",

                SuccessUrl =
                    _stripeSettings.SuccessUrl +
                    "?session_id={CHECKOUT_SESSION_ID}",

                CancelUrl =
                    _stripeSettings.CancelUrl,

                LineItems =
                    lineItems
            };

        var service =
            new SessionService();

        var session =
            await service.CreateAsync(
                options);

        var pendingOrder =
            new PendingOrder
            {
                UserId = userId,

                FullName =
                    request.FullName,

                PhoneNumber =
                    request.PhoneNumber,

                AddressLine1 =
                    request.AddressLine1,

                AddressLine2 =
                    request.AddressLine2,

                City =
                    request.City,

                State =
                    request.State,

                Country =
                    request.Country,

                PostalCode =
                    request.PostalCode,

                PaymentMethod =
                    "Stripe",

                StripeSessionId =
                    session.Id,

                TotalAmount =
                    totalAmount
            };

        _context.PendingOrders.Add(
            pendingOrder);

        await _context.SaveChangesAsync();

        foreach (var cartItem in cartItems)
        {
            var product =
                await _context.Products
                    .FirstOrDefaultAsync(
                        x => x.Id ==
                        cartItem.ProductId);

            if (product is null)
                continue;

            _context.PendingOrderItems.Add(
                new PendingOrderItem
                {
                    PendingOrderId =
                        pendingOrder.Id,

                    ProductId =
                        product.Id,

                    Quantity =
                        cartItem.Quantity,

                    Price =
                        product.Price
                });
        }

        await _context.SaveChangesAsync();

        return new CheckoutSessionResponse
        {
            SessionId =
                session.Id,

            Url =
                session.Url
        };
    }

    public async Task<bool>
    ConfirmPaymentAsync(
        string sessionId)
    {
        var sessionService =
            new SessionService();

        var session =
            await sessionService.GetAsync(
                sessionId);

        if (session.PaymentStatus != "paid")
        {
            return false;
        }

        var pendingOrder =
            await _context.PendingOrders
                .Include(x =>
                    x.PendingOrderItems)
                .FirstOrDefaultAsync(
                    x =>
                        x.StripeSessionId ==
                        sessionId);

        if (pendingOrder is null)
        {
            return false;
        }

        var order =
    await _orderService
        .CreateOrderFromPendingOrderAsync(
            pendingOrder);

        var user =
            await _context.Users
                .FirstOrDefaultAsync(
                    x => x.Id ==
                    pendingOrder.UserId);

        if (user is not null)
        {
            var body = $@"
        <h2>Payment Successful 🎉</h2>

        <p>Hello {user.Name},</p>

        <p>Your payment has been received successfully.</p>

        <hr/>

        <p><strong>Order ID:</strong> {order.Id}</p>

        <p><strong>Total Amount:</strong> ₹{order.TotalAmount}</p>

        <p><strong>Payment Method:</strong> Stripe</p>

        <p><strong>Status:</strong> {order.Status}</p>

        <hr/>

        <p>Thank you for shopping with Velocity Shop.</p>
    ";

            try
            {
                await _emailService.SendEmailAsync(
                    user.Email,
                    $"Order #{order.Id} Confirmation",
                    body);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[WARNING] Failed to send order confirmation email to {user.Email}: {ex.Message}");
            }
        }

        var cartItems =
            await _context.CartItems
                .Where(x =>
                    x.UserId ==
                    pendingOrder.UserId)
                .ToListAsync();

        _context.CartItems.RemoveRange(
            cartItems);

        _context.PendingOrderItems.RemoveRange(
            pendingOrder.PendingOrderItems);

        _context.PendingOrders.Remove(
            pendingOrder);

        await _context.SaveChangesAsync();
        return true;
    }
}