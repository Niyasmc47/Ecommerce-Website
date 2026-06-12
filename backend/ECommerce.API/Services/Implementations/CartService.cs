using ECommerce.API.DTOs.Requests;
using ECommerce.API.DTOs.Responses;
using ECommerce.API.Models;
using ECommerce.API.Repositories.Interfaces;
using ECommerce.API.Services.Interfaces;

namespace ECommerce.API.Services.Implementations;

public class CartService : ICartService
{
    private readonly IGenericRepository<CartItem> _cartRepository;
    private readonly IGenericRepository<Product> _productRepository;

    public CartService(
        IGenericRepository<CartItem> cartRepository,
        IGenericRepository<Product> productRepository)
    {
        _cartRepository = cartRepository;
        _productRepository = productRepository;
    }

    public async Task<IEnumerable<CartItemResponse>> GetCartAsync(
        int userId)
    {
        var cartItems =
            (await _cartRepository.GetAllAsync())
            .Where(x => x.UserId == userId)
            .ToList();

        var response = new List<CartItemResponse>();

        foreach (var item in cartItems)
        {
            var product =
                await _productRepository.GetByIdAsync(
                    item.ProductId);

            if (product is null)
                continue;

            response.Add(new CartItemResponse
            {
                Id = item.Id,
                ProductId = item.ProductId,
                ProductName = product.Name,
                Price = product.Price,
                Quantity = item.Quantity,
                TotalPrice = product.Price * item.Quantity
            });
        }

        return response;
    }

    public async Task<CartItemResponse> AddToCartAsync(
        int userId,
        AddToCartRequest request)
    {
        var product =
            await _productRepository.GetByIdAsync(
                request.ProductId);

        if (product is null)
            throw new Exception("Product not found.");

        var cartItem = new CartItem
        {
            UserId = userId,
            ProductId = request.ProductId,
            Quantity = request.Quantity
        };

        await _cartRepository.AddAsync(cartItem);

        return new CartItemResponse
        {
            Id = cartItem.Id,
            ProductId = product.Id,
            ProductName = product.Name,
            Price = product.Price,
            Quantity = cartItem.Quantity,
            TotalPrice = product.Price * cartItem.Quantity
        };
    }

    public async Task<CartItemResponse?> UpdateCartItemAsync(
        int cartItemId,
        UpdateCartItemRequest request)
    {
        var cartItem =
            await _cartRepository.GetByIdAsync(cartItemId);

        if (cartItem is null)
            return null;

        cartItem.Quantity = request.Quantity;

        await _cartRepository.UpdateAsync(cartItem);

        var product =
            await _productRepository.GetByIdAsync(
                cartItem.ProductId);

        if (product is null)
            return null;

        return new CartItemResponse
        {
            Id = cartItem.Id,
            ProductId = product.Id,
            ProductName = product.Name,
            Price = product.Price,
            Quantity = cartItem.Quantity,
            TotalPrice = product.Price * cartItem.Quantity
        };
    }

    public async Task<bool> RemoveCartItemAsync(
        int cartItemId)
    {
        var cartItem =
            await _cartRepository.GetByIdAsync(cartItemId);

        if (cartItem is null)
            return false;

        await _cartRepository.DeleteAsync(cartItem);

        return true;
    }
}