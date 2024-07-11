using CrudWebApi.Database;
using CrudWebApi.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using NLog;

namespace CrudWebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        private readonly EmployeeDbContext EmployeeDbContext;

        private static readonly NLog.Logger NLogLogger = NLog.LogManager.GetCurrentClassLogger();

       

        public EmployeeController(EmployeeDbContext employeeDbContext)
        {
            this.EmployeeDbContext = employeeDbContext;
        }

        [HttpGet]
        public async Task<IActionResult> GetEmployee()
        {
            var Employees = await EmployeeDbContext.Employees.ToListAsync();
            NLogLogger.Info("Kişiler veri tabanından çekildi.");
            return Ok(Employees);
        }

        [HttpPost]
        public async Task<IActionResult> CreateEmployee([FromBody] Employee emp)
        {
            emp.Id = new Guid();

            await EmployeeDbContext.Employees.AddAsync(emp);
            await EmployeeDbContext.SaveChangesAsync();

            NLogLogger.Info("Yeni kişi eklendi.");
            return Ok(emp);
        }

        [HttpPut]
        [Route("{id:guid}")]
        public async Task<IActionResult> UpdateEmployee([FromRoute] Guid id,[FromBody] Employee emp)
        {
            var employee=await EmployeeDbContext.Employees.FirstOrDefaultAsync(a => a.Id == id);
            if (employee != null)
            {
                employee.name = emp.name;
                employee.mobileNo = emp.mobileNo;
                employee.emailID = emp.emailID;
                await EmployeeDbContext.SaveChangesAsync();
                NLogLogger.Info("Kişi güncellendi.");
                return Ok(emp);
            }
            else
            {
                return NotFound("Employee not found");
            }
        }

        [HttpDelete]
        [Route("{id:guid}")]
        public async Task<IActionResult> DeleteEmployee([FromRoute] Guid Id)
        {
            var employee = await EmployeeDbContext.Employees.FirstOrDefaultAsync(a => a.Id == Id);
            if (employee != null)
            {
                EmployeeDbContext.Employees.Remove(employee);
                await EmployeeDbContext.SaveChangesAsync();
                NLogLogger.Info("Kişi silindi.");
                return Ok(employee);
            }
            else
            {
                return NotFound("Employee not found");
            }
        }
    }
}
