namespace ECommerce.API.DTOs.Responses;

public class OrderResponse
{
    public int Id { get; set; }

    public decimal TotalAmount { get; set; }

    public string Status { get; set; } = string.Empty;

    public DateTime CreatedDate { get; set; }
}