using ECommerce.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ECommerce.API.DTOs.Requests;
namespace ECommerce.API.Controllers;

[ApiController]
[Route("api/admin")]
[Authorize(Roles = "Admin")]
public class AdminController : ControllerBase
{
    private readonly IAdminService _adminService;

    public AdminController(
        IAdminService adminService)
    {
        _adminService = adminService;
    }

    [HttpGet("users")]
    public async Task<IActionResult> GetUsers()
    {
        return Ok(
            await _adminService.GetUsersAsync());
    }

    [HttpGet("orders")]
    public async Task<IActionResult> GetOrders()
    {
        return Ok(
            await _adminService.GetOrdersAsync());
    }

    [HttpGet("orders/{id}")]
    public async Task<IActionResult>
    GetOrderById(
        int id
    )
    {
        var order =
            await _adminService
                .GetOrderByIdAsync(
                    id
                );

        if (order is null)
        {
            return NotFound();
        }

        return Ok(order);
    }

    [HttpGet("dashboard")]
    public async Task<IActionResult> GetDashboard()
    {
        return Ok(
            await _adminService.GetDashboardAsync());
    }

    [HttpPut("orders/{id}/status")]
    public async Task<IActionResult>
        UpdateOrderStatus(
            int id,
            UpdateOrderStatusRequest request
        )
    {
        var success =
            await _adminService
                .UpdateOrderStatusAsync(
                    id,
                    request.Status
                );

        if (!success)
        {
            return NotFound();
        }

        return Ok();
    }


}