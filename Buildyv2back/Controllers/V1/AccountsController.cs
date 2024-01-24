using AutoMapper;
using Buildyv2.DTOs;
using EmailService;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Claims;
using System.Text;
using Wangkanai.Detection.Services;
using Buildyv2.Context;
using Buildyv2.Models;
using Buildyv2.Utilities;

namespace Buildyv2.Controllers.V1
{
    [ApiController]
    [HasHeader("x-version", "1")] // Agregar header: "x-version": "1"
    [Route("api/accounts")]
    public class AccountsController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<AccountsController> _logger; // Logger para registrar eventos. 
        private readonly IMapper _mapper;
        private readonly IEmailSender _emailSender;
        private readonly IDetectionService _detectionService;
        private readonly UserManager<BuildyUser> _userManager;
        private readonly SignInManager<BuildyUser> _signInManager;
        private readonly RoleManager<BuildyRole> _roleManager;
        private readonly ContextDB _contextDB;
        private APIResponse _response;

        public AccountsController
        (
            ILogger<AccountsController> logger,
            IMapper mapper,
            IConfiguration configuration,
            IEmailSender emailSender,
            IDetectionService detectionService,
            UserManager<BuildyUser> userManager,
            SignInManager<BuildyUser> signInManager,
            RoleManager<BuildyRole> roleManager,
            ContextDB dbContext
        )
        {
            _response = new();
            _logger = logger;
            _mapper = mapper;
            _configuration = configuration;
            _emailSender = emailSender;
            _detectionService = detectionService;
            _userManager = userManager;
            _signInManager = signInManager;
            _roleManager = roleManager;
            _contextDB = dbContext;
        }

        #region Endpoints genéricos

        [HttpGet("GetUsers")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "IsAdmin")]
        public async Task<ActionResult<APIResponse>> GetUsers([FromQuery] PaginationDTO paginationDTO)
        {
            try
            {
                var queryable = _contextDB.BuildyUser;
                await HttpContext.InsertParamPaginationHeader(queryable);
                var users = await queryable.OrderBy(x => x.Email).DoPagination(paginationDTO).ToListAsync();
                _response.Result = users;
                _response.StatusCode = HttpStatusCode.OK;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.ToString());
                _response.IsSuccess = false;
                _response.StatusCode = HttpStatusCode.InternalServerError;
                _response.ErrorMessages = new List<string> { ex.ToString() };
            }
            return Ok(_response);
        }

        [HttpGet("GetRoles")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "IsAdmin")]
        public async Task<ActionResult<APIResponse>> GetRoles()
        {
            try
            {
                var roles = await _roleManager.Roles.ToListAsync();
                _response.Result = roles;
                _response.StatusCode = HttpStatusCode.OK;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.ToString());
                _response.IsSuccess = false;
                _response.StatusCode = HttpStatusCode.InternalServerError;
                _response.ErrorMessages = new List<string> { ex.ToString() };
            }
            return Ok(_response);
        }

        [HttpGet("GetUserRole/{id}")]
        public async Task<ActionResult<APIResponse>> GetUserRole(string id)
        {
            try
            {
                var user = await _userManager.Users.FirstOrDefaultAsync(u => u.Id == id);
                if (user == null)
                {
                    return NotFound();
                }

                var roles = await _userManager.GetRolesAsync(user);
                _response.Result = roles;
                _response.StatusCode = HttpStatusCode.OK;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.ToString());
                _response.IsSuccess = false;
                _response.StatusCode = HttpStatusCode.InternalServerError;
                _response.ErrorMessages = new List<string> { ex.ToString() };
            }
            return Ok(_response);
        }

        [HttpPost("makeAdmin")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "IsAdmin")]
        public async Task<ActionResult<APIResponse>> MakeAdmin([FromBody] string usuarioId)
        {
            try
            {
                var user = await _userManager.FindByIdAsync(usuarioId);
                await _userManager.AddClaimAsync(user, new Claim("role", "admin"));
                _response.StatusCode = HttpStatusCode.OK;
                _response.Result = NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.ToString());
                _response.IsSuccess = false;
                _response.StatusCode = HttpStatusCode.InternalServerError;
                _response.ErrorMessages = new List<string> { ex.ToString() };
            }
            return Ok(_response);
        }

        [HttpPost("removeAdmin")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "IsAdmin")]
        public async Task<ActionResult<APIResponse>> RemoveAdmin([FromBody] string usuarioId)
        {
            try
            {
                var user = await _userManager.FindByIdAsync(usuarioId);
                await _userManager.RemoveClaimAsync(user, new Claim("role", "admin"));
                _response.StatusCode = HttpStatusCode.OK;
                _response.Result = NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.ToString());
                _response.IsSuccess = false;
                _response.StatusCode = HttpStatusCode.InternalServerError;
                _response.ErrorMessages = new List<string> { ex.ToString() };
            }
            return Ok(_response);
        }

        [HttpPost("register")] //api/accounts/register
        public async Task<ActionResult<APIResponse>> Register(RegisterModel model)
        {
            try
            {
                var user = new BuildyUser
                {
                    UserName = model.Username,
                    Email = model.Email,
                    Name = model.Name,
                };
                var result = await _userManager.CreateAsync(user, model.Password);
                if (result.Succeeded)
                {
                    _logger.LogInformation("Registración correcta.");
                    _response.StatusCode = HttpStatusCode.OK;

                    // Asignar el rol al usuario
                    if (!string.IsNullOrEmpty(model.UserRoleId))
                    {
                        var roleResult = await _userManager.AddToRoleAsync(user, model.UserRoleName);
                        if (!roleResult.Succeeded)
                        {
                            _response.IsSuccess = false;
                            _response.StatusCode = HttpStatusCode.InternalServerError;
                            _logger.LogError($"Error al asignar rol al usuario.");
                        }
                    }

                    var userCredential = new UserCredential
                    {
                        Username = user.UserName,
                        Password = model.Password
                    };
                    _response.Result = await TokenSetup(userCredential);
                }
                else
                {
                    _logger.LogError($"Registración incorrecta.");
                    _response.IsSuccess = false;
                    _response.StatusCode = HttpStatusCode.BadRequest;
                    return BadRequest(result.Errors);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.ToString());
                _response.IsSuccess = false;
                _response.StatusCode = HttpStatusCode.InternalServerError;
                _response.ErrorMessages = new List<string> { ex.ToString() };
            }
            return Ok(_response);
        }

        [HttpPut("UpdateUser/{id}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "IsAdmin")]
        public async Task<ActionResult<APIResponse>> UpdateUser(string id, [FromBody] UpdateUserModel model)
        {
            try
            {
                var user = await _userManager.FindByIdAsync(id);
                if (user == null)
                {
                    _response.IsSuccess = false;
                    _response.StatusCode = HttpStatusCode.NotFound;
                    return NotFound(_response);
                }

                // Actualiza los campos del usuario
                user.UserName = model.Username; // Si el email es también el nombre de usuario
                user.Email = model.Email;
                user.Name = model.Name;

                var updateResult = await _userManager.UpdateAsync(user);
                if (!updateResult.Succeeded)
                {
                    _response.IsSuccess = false;
                    _response.StatusCode = HttpStatusCode.InternalServerError;
                    _response.ErrorMessages = updateResult.Errors.Select(e => e.Description).ToList();
                    return BadRequest(_response);
                }

                // Actualiza el rol si es necesario
                if (!string.IsNullOrEmpty(model.UserRoleId))
                {
                    var roles = await _userManager.GetRolesAsync(user);
                    await _userManager.RemoveFromRolesAsync(user, roles);
                    await _userManager.AddToRoleAsync(user, model.UserRoleName);
                }

                _response.StatusCode = HttpStatusCode.OK;
                _response.Result = _mapper.Map<UserDTO>(user); // Mapea el usuario actualizado a un DTO si es necesario
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.ToString());
                _response.IsSuccess = false;
                _response.StatusCode = HttpStatusCode.InternalServerError;
                _response.ErrorMessages = new List<string> { ex.ToString() };
            }
            return Ok(_response);
        }

        [HttpPost("login")]
        public async Task<ActionResult<APIResponse>> Login([FromBody] UserCredential userCredential)
        {
            try
            {
                // lockoutOnFailure: bloquea al usuario si tiene muchos intentos de logueo
                var result = await _signInManager.PasswordSignInAsync(userCredential.Username, userCredential.Password, isPersistent: false, lockoutOnFailure: false);
                if (result.Succeeded)
                {
                    _logger.LogInformation("Login correcto.");
                    var user = await _userManager.FindByNameAsync(userCredential.Username);
                    var roles = await _userManager.GetRolesAsync(user); // Obtener roles del usuario

                    _response.StatusCode = HttpStatusCode.OK;
                    _response.Result = new
                    {
                        Token = await TokenSetup(userCredential),
                        UserRoles = roles // Añade los roles del usuario aquí
                    };
                    await SendLoginNotification(userCredential);
                }
                else
                {
                    _logger.LogError($"Login incorrecto.");
                    _response.IsSuccess = false;
                    _response.StatusCode = HttpStatusCode.BadRequest;
                    return BadRequest("Login incorrecto");  // respuesta genérica para no revelar información
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.ToString());
                _response.IsSuccess = false;
                _response.StatusCode = HttpStatusCode.InternalServerError;
                _response.ErrorMessages = new List<string> { ex.ToString() };
            }
            return Ok(_response);
        }


        [HttpPost("CreateUserRole")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "IsAdmin")]
        public async Task<ActionResult<APIResponse>> CreateUserRole([FromBody] CreateRoleModel model)
        {
            try
            {
                var roleExist = await _roleManager.RoleExistsAsync(model.Name);
                if (roleExist)
                {
                    _response.IsSuccess = false;
                    _response.StatusCode = HttpStatusCode.BadRequest;
                    _response.ErrorMessages = new List<string> { "El rol ya existe." };
                    return BadRequest(_response);
                }

                var newRole = new BuildyRole
                {
                    Name = model.Name
                };

                var result = await _roleManager.CreateAsync(newRole);
                if (result.Succeeded)
                {
                    _response.StatusCode = HttpStatusCode.Created;
                    _response.Result = newRole;
                }
                else
                {
                    _response.IsSuccess = false;
                    _response.StatusCode = HttpStatusCode.InternalServerError;
                    _response.ErrorMessages = result.Errors.Select(e => e.Description).ToList();
                    return BadRequest(_response);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.ToString());
                _response.IsSuccess = false;
                _response.StatusCode = HttpStatusCode.InternalServerError;
                _response.ErrorMessages = new List<string> { ex.ToString() };
                return StatusCode(500, _response);
            }
            return Ok(_response);
        }

        [HttpPut("UpdateUserRole/{id}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "IsAdmin")]
        public async Task<ActionResult<APIResponse>> UpdateUserRole(string id, [FromBody] UpdateUserRoleModel model)
        {
            try
            {
                var userRole = await _roleManager.FindByIdAsync(id);
                if (userRole == null)
                {
                    _response.IsSuccess = false;
                    _response.StatusCode = HttpStatusCode.NotFound;
                    return NotFound(_response);
                }

                userRole.Name = model.Name;
                var updateResult = await _roleManager.UpdateAsync(userRole);
                if (!updateResult.Succeeded)
                {
                    _response.IsSuccess = false;
                    _response.StatusCode = HttpStatusCode.InternalServerError;
                    _response.ErrorMessages = updateResult.Errors.Select(e => e.Description).ToList();
                    return BadRequest(_response);
                }

                _response.StatusCode = HttpStatusCode.OK;
                _response.Result = _mapper.Map<UserDTO>(userRole); // Mapea el usuario actualizado a un DTO si es necesario
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.ToString());
                _response.IsSuccess = false;
                _response.StatusCode = HttpStatusCode.InternalServerError;
                _response.ErrorMessages = new List<string> { ex.ToString() };
            }
            return Ok(_response);
        }

        #endregion

        #region Endpoints específicos

        #endregion

        #region Private methods

        private async Task<AuthenticationResponse> TokenSetup(UserCredential userCredential)
        {
            var user = await _userManager.FindByNameAsync(userCredential.Username);
            if (user == null)
            {
                return null;
            }
            var claims = new List<Claim>()
            {
                new Claim("email", userCredential.Username)
                //new Claim("username", userCredential.Username)
            };

            var claimsDB = await _userManager.GetClaimsAsync(user);
            if (claimsDB != null)
            {
                claims.AddRange(claimsDB);
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:key"]));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var expiration = DateTime.UtcNow.AddYears(1);

            var token = new JwtSecurityToken(issuer: null, audience: null, claims: claims,
                expires: expiration, signingCredentials: credentials);

            return new AuthenticationResponse()
            {
                Token = new JwtSecurityTokenHandler().WriteToken(token),
                Expiration = expiration
            };
        }

        #region Email

        private async Task SendLoginNotification(UserCredential userCredential)
        {
#pragma warning disable CS8632 // The annotation for nullable reference types should only be used in code within a '#nullable' annotations context.
            string? clientIP = HttpContext.Connection.RemoteIpAddress?.ToString();
#pragma warning restore CS8632 // The annotation for nullable reference types should only be used in code within a '#nullable' annotations context.
            string? clientIPCity = await GetIpInfo(clientIP);
            bool isMobile = _detectionService.Device.Type == Wangkanai.Detection.Models.Device.Mobile;
            await SendAsyncEmail(userCredential, clientIP, clientIPCity, isMobile);
        }

        private static async Task<string?> GetIpInfo(string? Ip_Api_Url)
        {
            string? returnString = string.Empty;
            if (!string.IsNullOrWhiteSpace(Ip_Api_Url) && Ip_Api_Url != "::1")
            {
                using (HttpClient httpClient = new())
                {
                    try
                    {
                        httpClient.DefaultRequestHeaders.Accept.Clear();
                        httpClient.DefaultRequestHeaders.Accept.Add(new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/json"));

                        HttpResponseMessage httpResponse = await httpClient.GetAsync("http://ip-api.com/json/" + Ip_Api_Url);
                        if (httpResponse.IsSuccessStatusCode)
                        {
                            var geolocationInfo = await httpResponse.Content.ReadFromJsonAsync<LocationDetails_IpApi>();
                            returnString = geolocationInfo?.city;
                        }
                    }
                    catch (Exception)
                    {
                        //ServiceLog.AddException("Excepcion. Obteniendo info de IP al login. ERROR: " + ex.Message, MethodBase.GetCurrentMethod()?.DeclaringType?.Name, MethodBase.GetCurrentMethod()?.Name, ex.Message);
                    }
                }
            }
            return returnString;
        }

        private async Task SendAsyncEmail(UserCredential userCredential, string? clientIP, string? clientIPCity, bool isMobile)
        {
            string emailNotificationDestination = _configuration["NotificationEmail:To"];
            string emailNotificationSubject = _configuration["NotificationEmail:Subject"];
            string emailNotificationBody = GlobalServices.GetEmailNotificationBody(userCredential, clientIP, clientIPCity, isMobile);
            var message = new Message(new string[] { emailNotificationDestination }, emailNotificationSubject, emailNotificationBody);
            await _emailSender.SendEmailAsync(message);
        }

        private class LocationDetails_IpApi
        {
            public string? query { get; set; }
            public string? city { get; set; }
            public string? country { get; set; }
            public string? countryCode { get; set; }
            public string? isp { get; set; }
            public double lat { get; set; }
            public double lon { get; set; }
            public string? org { get; set; }
            public string? region { get; set; }
            public string? regionName { get; set; }
            public string? status { get; set; }
            public string? timezone { get; set; }
            public string? zip { get; set; }
        }

        public class RegisterModel
        {
            public string Username { get; set; }
            public string Name { get; set; }
            public string Email { get; set; }
            public string Password { get; set; }
            public string UserRoleId { get; set; }
            public string UserRoleName { get; set; }
        }

        public class UpdateUserModel
        {
            public string Username { get; set; }
            public string Name { get; set; }
            public string Email { get; set; }
            public string UserRoleId { get; set; }
            public string UserRoleName { get; set; }
        }

        public class CreateRoleModel
        {
            public string Name { get; set; }
        }

        public class UpdateUserRoleModel
        {
            public string Name { get; set; }
        }

        #endregion

        #endregion

    }
}