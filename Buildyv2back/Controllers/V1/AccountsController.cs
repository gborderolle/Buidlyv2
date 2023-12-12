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
using Buildyv2.DTOs;
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
        private readonly UserManager<IdentityUser> _userManager;
        private readonly SignInManager<IdentityUser> _signInManager;
        private readonly ContextDB _contextDB;
        private APIResponse _response;

        public AccountsController
        (
            ILogger<AccountsController> logger,
            IMapper mapper,
            IConfiguration configuration,
            IEmailSender emailSender,
            IDetectionService detectionService,
            UserManager<IdentityUser> userManager,
            SignInManager<IdentityUser> signInManager,
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
            _contextDB = dbContext;
        }

        #region Endpoints genéricos

        [HttpGet("listUsers")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "IsAdmin")]
        public async Task<ActionResult<APIResponse>> ListUsers([FromQuery] PaginationDTO paginationDTO)
        {
            try
            {
                var queryable = _contextDB.Users.AsQueryable();
                await HttpContext.InsertParamPaginationHeader(queryable);
                var users = await queryable.OrderBy(x => x.Email).DoPagination(paginationDTO).ToListAsync();
                _response.Result = _mapper.Map<List<UserDTO>>(users);
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

        //

        [HttpPost("register")] //api/accounts/register
        public async Task<ActionResult<APIResponse>> Register(UserCredential userCredential)
        {
            try
            {
                var user = new IdentityUser { UserName = userCredential.Email, Email = userCredential.Email };
                var result = await _userManager.CreateAsync(user, userCredential.Password);
                if (result.Succeeded)
                {
                    _logger.LogInformation("Registración correcta.");
                    _response.StatusCode = HttpStatusCode.OK;
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

        [HttpPost("login")]
        public async Task<ActionResult<APIResponse>> Login([FromBody] UserCredential userCredential)
        {
            try
            {
                // lockoutOnFailure: bloquea al usuario si tiene muchos intentos de logueo
                var result = await _signInManager.PasswordSignInAsync(userCredential.Email, userCredential.Password, isPersistent: false, lockoutOnFailure: false);
                if (result.Succeeded)
                {
                    _logger.LogInformation("Login correcto.");
                    _response.StatusCode = HttpStatusCode.OK;
                    _response.Result = await TokenSetup(userCredential);
                    await SendLoginNotification(userCredential);
                }
                else
                {
                    _logger.LogError($"Login incorrecto.");
                    _response.IsSuccess = false;
                    _response.StatusCode = HttpStatusCode.BadRequest;
                    return BadRequest("Login incorrecto"); // respuesta genérica para no revelar información
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

        #endregion

        #region Endpoints específicos

        #endregion

        #region Private methods

        private async Task<AuthenticationResponse> TokenSetup(UserCredential userCredential)
        {
            var user = await _userManager.FindByEmailAsync(userCredential.Email);
            if (user == null)
            {
                return null;
            }
            var claims = new List<Claim>()
            {
                new Claim("email", userCredential.Email)
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
            string? clientIP = HttpContext.Connection.RemoteIpAddress?.ToString();
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
                    catch (Exception ex)
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

        #endregion

        #endregion

    }
}