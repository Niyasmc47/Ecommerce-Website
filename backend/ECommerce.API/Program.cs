using ECommerce.API.Data;
using Microsoft.EntityFrameworkCore;
using ECommerce.API.Authentication;
using ECommerce.API.Services.Implementations;
using ECommerce.API.Services.Interfaces;
using ECommerce.API.Extensions;
using FluentValidation;
using ECommerce.API.Cloudinary;
using FluentValidation.AspNetCore;
using ECommerce.API.Validators;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
// using Microsoft.OpenApi.Models;
using System.Text;
using ECommerce.API.Email;

using ECommerce.API.Mappings;
using ECommerce.API.Repositories.Interfaces;
using ECommerce.API.Repositories.Implementations;
using ECommerce.API.DTOs.Requests;
using DotNetEnv;
using ECommerce.API.Stripe;

Env.Load(); // Load environment variables from .env file

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddHttpClient();

builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1",
        new Microsoft.OpenApi.OpenApiInfo
        {
            Title = "ECommerce API",
            Version = "v1"
        });
});

builder.Services.Configure<JwtSettings>(
    builder.Configuration.GetSection("JwtSettings"));
builder.Services.AddScoped<
    ITurnstileService,
    TurnstileService>();

builder.Services.AddScoped<JwtTokenGenerator>();

builder.Services.AddScoped<IAuthService, AuthService>();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers();
builder.Services.AddAutoMapper(
    typeof(MappingProfile));

builder.Services.Configure<StripeSettings>(
    builder.Configuration.GetSection("Stripe"));

var sp = builder.Services.BuildServiceProvider();
var stripeSettings = sp.GetRequiredService<Microsoft.Extensions.Options.IOptions<ECommerce.API.Stripe.StripeSettings>>().Value;
Console.WriteLine("\n=== STRIPE CONFIG ===");
Console.WriteLine($"SecretKey: {stripeSettings.SecretKey}");
Console.WriteLine($"SuccessUrl: {stripeSettings.SuccessUrl}");
Console.WriteLine($"CancelUrl: {stripeSettings.CancelUrl}");
Console.WriteLine("=====================\n");

builder.Services.Configure<EmailSettings>(
    builder.Configuration.GetSection(
        "EmailSettings"));

builder.Services.AddScoped<IEmailService,
    EmailService>();

var jwtSettings = builder.Configuration
    .GetSection("JwtSettings")
    .Get<JwtSettings>();

builder.Services.AddAuthentication(
    JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters =
            new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,

                ValidIssuer = jwtSettings!.Issuer,
                ValidAudience = jwtSettings.Audience,

                IssuerSigningKey =
                    new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(
                            jwtSettings.SecretKey))
            };
    });

builder.Services.AddAuthorization();

builder.Services.AddFluentValidationAutoValidation();

builder.Services.AddValidatorsFromAssemblyContaining<RegisterRequestValidator>();

builder.Services.AddScoped<IValidator<RegisterRequest>,
    RegisterRequestValidator>();

builder.Services.AddScoped<IValidator<LoginRequest>,
    LoginRequestValidator>();

builder.Services.AddScoped(
    typeof(IGenericRepository<>),
    typeof(GenericRepository<>));

builder.Services.AddScoped<ICartService, CartService>();

builder.Services.AddScoped<IProductService, ProductService>();

builder.Services.AddScoped<ICategoryService, CategoryService>();

builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<IDeliveryService,DeliveryService>();

builder.Services.AddScoped<
    IReviewService,
    ReviewService>();

builder.Services.AddScoped<IPaymentService, PaymentService>();

builder.Services.Configure<CloudinarySettings>(
    builder.Configuration.GetSection("CloudinarySettings"));

var cloudinarySettings =
    builder.Configuration
        .GetSection("CloudinarySettings")
        .Get<CloudinarySettings>();

builder.Services.AddSingleton(
    cloudinarySettings!);

builder.Services.AddScoped<
    ICloudinaryService,
    CloudinaryService>();


builder.Services.AddScoped<
    IAdminService,
    AdminService>();

builder.Services.AddScoped<
    ISellerService,
    SellerService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend",
        policy =>
        {
            policy
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowAnyOrigin();
        });
});

var app = builder.Build();

app.UseCors("Frontend");

app.UseGlobalExceptionMiddleware();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();