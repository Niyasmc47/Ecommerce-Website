using ECommerce.API.Data;
using ECommerce.API.DTOs.Responses;
using ECommerce.API.Models;
using ECommerce.API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.API.Services.Implementations;

public class OrderService : IOrderService
{
    private readonly ApplicationDbContext _context;

    public OrderService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<OrderResponse>> GetOrdersAsync(
        int userId)
    {
        return await _context.Orders
            .Where(x => x.UserId == userId)
            .Select(x => new OrderResponse
            {
                Id = x.Id,
                TotalAmount = x.TotalAmount,
                Status = x.Status,
                CreatedDate = x.CreatedDate
            })
            .ToListAsync();
    }

    public async Task<OrderResponse?> GetOrderByIdAsync(
        int userId,
        int orderId)
    {
        var order = await _context.Orders
            .FirstOrDefaultAsync(x =>
                x.Id == orderId &&
                x.UserId == userId);

        if (order is null)
            return null;

        return new OrderResponse
        {
            Id = order.Id,
            TotalAmount = order.TotalAmount,
            Status = order.Status,
            CreatedDate = order.CreatedDate
        };
    }

    public async Task<OrderResponse> CreateOrderAsync(
        int userId)
    {
        var cartItems = await _context.CartItems
            .Where(x => x.UserId == userId)
            .ToListAsync();

        if (!cartItems.Any())
            throw new Exception("Cart is empty.");

        decimal totalAmount = 0;

        var order = new Order
        {
            UserId = userId,
            Status = "Pending"
        };

        _context.Orders.Add(order);

        await _context.SaveChangesAsync();

        foreach (var cartItem in cartItems)
        {
            var product = await _context.Products
                .FirstOrDefaultAsync(
                    x => x.Id == cartItem.ProductId);

            if (product is null)
                continue;

            totalAmount +=
                product.Price * cartItem.Quantity;

            _context.OrderItems.Add(
                new OrderItem
                {
                    OrderId = order.Id,
                    ProductId = product.Id,
                    Quantity = cartItem.Quantity,
                    Price = product.Price
                });
        }

        order.TotalAmount = totalAmount;

        _context.CartItems.RemoveRange(cartItems);

        await _context.SaveChangesAsync();

        return new OrderResponse
        {
            Id = order.Id,
            TotalAmount = order.TotalAmount,
            Status = order.Status,
            CreatedDate = order.CreatedDate
        };
    }
}