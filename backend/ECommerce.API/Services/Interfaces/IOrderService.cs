using ECommerce.API.DTOs.Responses;

namespace ECommerce.API.Services.Interfaces;

public interface IOrderService
{
    Task<IEnumerable<OrderResponse>> GetOrdersAsync(
        int userId);

    Task<OrderResponse?> GetOrderByIdAsync(
        int userId,
        int orderId);

    Task<OrderResponse> CreateOrderAsync(
        int userId);
}