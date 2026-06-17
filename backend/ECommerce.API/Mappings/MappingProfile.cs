using AutoMapper;
using ECommerce.API.DTOs.Responses;
using ECommerce.API.Models;

namespace ECommerce.API.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<Product, ProductResponse>();

        CreateMap<Category, CategoryResponse>();

        CreateMap<User, UserResponse>();

        CreateMap<Order, OrderResponse>();

        
    }
}