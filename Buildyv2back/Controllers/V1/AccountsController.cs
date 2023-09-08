using AutoMapper;
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
using Buildyv2.DTOs;
using WebAPI_tutorial_peliculas.Context;
using WebAPI_tutorial_peliculas.DTOs;
using WebAPI_tutorial_peliculas.Models;
using WebAPI_tutorial_peliculas.Utilities;

namespace WebAPI_tutorial_peliculas.Controllers.V1
{
    [ApiController]
    [HasHeader("x-version", "1")] // Agregar header: "x-version": "1"
    [Route("api/accounts")]
    public class AccountsController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<AccountsController> _logger; // Logger para registrar eventos.
        protected readonly IMapper _mapper;
        private readonly UserManager<IdentityUser> _userManager;
        private readonly SignInManager<IdentityUser> _signInManager;
        private readonly ContextDB _contextDB;
        protected APIResponse _response;

        public AccountsController
        (
            ILogger<AccountsController> logger,
            IMapper mapper,
            IConfiguration configuration,
            UserManager<IdentityUser> userManager,
            SignInManager<IdentityUser> signInManager,
            ContextDB dbContext
        )
        {
            _response = new();
            _mapper = mapper;
            _logger = logger;
            _userManager = userManager;
            _configuration = configuration;
            _signInManager = signInManager;
            _contextDB = dbContext;
        }

        #region Endpoints genéricos

        [HttpPost("register", Name = "Registerv2")] //api/accounts/register
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

        [HttpPost("login", Name = "Loginv2")]
        public async Task<ActionResult<APIResponse>> Login(UserCredential userCredential)
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

        /// <summary>
        /// Renueva el token automáticamente
        /// Clase: https://www.udemy.com/course/construyendo-web-apis-restful-con-aspnet-core/learn/lecture/27047668#notes
        /// </summary>
        /// <returns></returns>
        [HttpGet("RenewToken", Name = "RenewTokenv2")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<ActionResult<APIResponse>> RenewToken()
        {
            try
            {
                var userCredential = new UserCredential()
                {
                    Email = HttpContext.User.Identity.Name
                };
                _response.Result = await TokenSetup(userCredential);
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

        [HttpPost("MakeAdmin", Name = "MakeAdminv2")]
        public async Task<ActionResult<APIResponse>> MakeAdmin(EditAdminDTO editAdminDTO)
        {
            try
            {
                var user = await _userManager.FindByEmailAsync(editAdminDTO.Email);
                await _userManager.AddClaimAsync(user, new Claim("IsAdmin", "1"));
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

        [HttpPost("DeleteAdmin", Name = "DeleteAdminv2")]
        public async Task<ActionResult<APIResponse>> DeleteAdmin(EditAdminDTO editAdminDTO)
        {
            try
            {
                var user = await _userManager.FindByEmailAsync(editAdminDTO.Email);
                await _userManager.RemoveClaimAsync(user, new Claim("IsAdmin", "1"));
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

        #endregion

        #region Endpoints específicos

        [HttpGet("Create")]
        public async Task<ActionResult<APIResponse>> CreateUser([FromBody] UserCredential userCredential)
        {
            try
            {
                var user = new IdentityUser
                {
                    UserName = userCredential.Email,
                    Email = userCredential.Email
                };

                var result = await _userManager.CreateAsync(user, userCredential.Password);
                if (result.Succeeded)
                {
                    _response.Result = await TokenSetup(userCredential);
                    _response.StatusCode = HttpStatusCode.OK;
                    return Ok(_response);
                }
                else
                {
                    _logger.LogError(result.ToString());
                    _response.IsSuccess = false;
                    _response.StatusCode = HttpStatusCode.InternalServerError;
                    _response.ErrorMessages = new List<string> { result.ToString() };
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

        [HttpGet("Users")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "Admin")]
        public async Task<ActionResult<APIResponse>> Get([FromQuery] PaginationDTO paginationDTO)
        {
            try
            {
                var queryable = _contextDB.Users.AsQueryable();
                queryable = queryable.OrderBy(x => x.Email);
                //_response.Result = await Get<IdentityUser, UserDTO>(paginationDTO: paginationDTO);
                _response.Result = await GetUsers(paginationDTO);
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

        [HttpGet("Roles")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "Admin")]
        public async Task<ActionResult<APIResponse>> GetRole()
        {
            try
            {
                _response.Result = await _contextDB.Roles.Select(x => x.Name).ToListAsync();
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

        [HttpGet("SetRole")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "Admin")]
        public async Task<ActionResult<APIResponse>> SetRole(EditRoleDTO editRoleDTO)
        {
            try
            {
                var user = await _userManager.FindByIdAsync(editRoleDTO.UserId);
                if (user == null)
                {
                    _logger.LogError($"Usuario no encontrado ID = {editRoleDTO.UserId}.");
                    _response.ErrorMessages = new List<string> { $"Usuario no encontrado ID = {editRoleDTO.UserId}." };
                    _response.IsSuccess = false;
                    _response.StatusCode = HttpStatusCode.NotFound;
                    return NotFound($"Usuario no encontrado ID = {editRoleDTO.UserId}.");
                }
                _response.Result = await _userManager.AddClaimAsync(user, new Claim(ClaimTypes.Role, editRoleDTO.RoleName));
                _response.StatusCode = HttpStatusCode.NoContent;
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

        [HttpGet("RemoveRole")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "Admin")]
        public async Task<ActionResult<APIResponse>> RemoveRole(EditRoleDTO editRoleDTO)
        {
            try
            {
                var user = await _userManager.FindByIdAsync(editRoleDTO.UserId);
                if (user == null)
                {
                    _logger.LogError($"Usuario no encontrado ID = {editRoleDTO.UserId}.");
                    _response.ErrorMessages = new List<string> { $"Usuario no encontrado ID = {editRoleDTO.UserId}." };
                    _response.IsSuccess = false;
                    _response.StatusCode = HttpStatusCode.NotFound;
                    return NotFound($"Usuario no encontrado ID = {editRoleDTO.UserId}.");
                }
                _response.Result = await _userManager.RemoveClaimAsync(user, new Claim(ClaimTypes.Role, editRoleDTO.RoleName));
                _response.StatusCode = HttpStatusCode.NoContent;
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

        #region Private methods

        /// <summary>
        ///  APIResponse sólo va cuando es un método http expuesto (no un método local)
        /// </summary>
        /// <param name="userCredential"></param>
        /// <returns></returns>
        private async Task<AuthenticationResponse> TokenSetup(UserCredential userCredential)
        {
            // Claim = información encriptada pero que no sea sensible (no usar tarjetas de crédito, por ej.)
            var claims = new List<Claim>()
            {
                new Claim(ClaimTypes.Name , userCredential.Email),
                new Claim(ClaimTypes.Email , userCredential.Email)
            };

            // Clase: https://www.udemy.com/course/construyendo-web-apis-restful-con-aspnet-core/learn/lecture/27047714#notes
            var identityUser = await _userManager.FindByEmailAsync(userCredential.Email);
            claims.Add(new Claim(ClaimTypes.NameIdentifier, identityUser.Id)); // línea nueva! Clase: https://www.udemy.com/course/construyendo-web-apis-restful-con-aspnet-core/learn/lecture/20660148#notes

            var claimsDB = await _userManager.GetClaimsAsync(identityUser);
            claims.AddRange(claimsDB);

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:key"]));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var expiration = DateTime.UtcNow.AddYears(1);

            JwtSecurityToken token = new
                (
                    issuer: null,
                    audience: null,
                    claims: claims,
                    expires: expiration,
                    signingCredentials: credentials
                );
            return new AuthenticationResponse
            {
                Token = new JwtSecurityTokenHandler().WriteToken(token),
                Expiration = expiration
            };
        }

        private async Task<List<IdentityUser>> GetUsers(PaginationDTO paginationDTO)
        {
            var queryable = _contextDB.Users.AsQueryable();
            await HttpContext.InsertParamPaginationHeader(queryable, paginationDTO.RecordsPerPage);
            return await queryable.DoPagination(paginationDTO).ToListAsync();
        }

        #endregion

    }
}