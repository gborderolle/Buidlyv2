using Buildyv2.ApiBehavior;
using Buildyv2.Context;
using Buildyv2.Filters;
using Buildyv2.Middlewares;
using Buildyv2.Models;
using Buildyv2.Repository;
using Buildyv2.Repository.Interfaces;
using Buildyv2.Services;
using Buildyv2.Utilities;
using EmailService;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Localization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Globalization;
using System.IdentityModel.Tokens.Jwt;
using System.Reflection;
using System.Text;
using System.Text.Json.Serialization;

[assembly: ApiConventionType(typeof(DefaultApiConventions))] // Clase: https://www.udemy.com/course/construyendo-web-apis-restful-con-aspnet-core/learn/lecture/27148912#notes
namespace Buildyv2
{
    public class Startup
    {
        public IConfiguration Configuration { get; }

        public Startup(IConfiguration configuration)
        {
            // Limpia los mapeos de los tipos de los Claims (del login de usuario)
            JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear(); // Clase: https://www.udemy.com/course/construyendo-web-apis-restful-con-aspnet-core/learn/lecture/27047628#notes
            Configuration = configuration;
        }

        /// <summary>
        /// Configuración de los Services
        /// </summary>
        /// <param name="services"></param>
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers(options =>
            {
                // Clase: https://www.udemy.com/course/construyendo-web-apis-restful-con-aspnet-core/learn/lecture/13816116#notes
                options.Filters.Add(typeof(ExceptionFilter));
                options.Filters.Add(typeof(BadRequestParse));
                options.Conventions.Add(new SwaggerGroupByVersion());
            })
            .ConfigureApiBehaviorOptions(BehaviorBadRequests.Parse)
            .AddNewtonsoftJson(options =>
            {
                options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
            })
            .AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles; // para arreglar errores de loop de relaciones 1..n y viceversa
            });
            services.AddEndpointsApiExplorer();
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo
                {
                    Title = "Buildy 2.0",
                    Version = "v1",
                    Description = "API de Buildy",
                    Contact = new OpenApiContact
                    {
                        Email = "gborderolle@gmail.com",
                        Name = "Gonzalo Borderolle",
                        Url = new Uri("https://linkedin.com/in/gborderolle")
                    }
                });

                c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Name = "Authorization",
                    Type = SecuritySchemeType.ApiKey,
                    Scheme = "Bearer",
                    BearerFormat = "JWT",
                    In = ParameterLocation.Header
                });

                c.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference=new OpenApiReference
                            {
                                Type=ReferenceType.SecurityScheme,
                                Id="Bearer"
                            }
                        },
                        new string[]{ }
                    }
                });

                var fileXML = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
                var routeXML = Path.Combine(AppContext.BaseDirectory, fileXML);
                c.IncludeXmlComments(routeXML);
            });

            // Configuración de la base de datos
            services.AddDbContext<ContextDB>(options =>
            {
                options.UseSqlServer(Configuration.GetConnectionString("ConnectionString_Buildyv2"));
            });

            services.AddAutoMapper(typeof(Startup));

            // Registro de servicios 
            // --------------

            // AddTransient: cambia dentro del contexto
            // AddScoped: se mantiene dentro del contexto (mejor para los servicios)
            // AddSingleton: no cambia nunca

            // Repositorios
            services.AddScoped<IEstateRepository, EstateRepository>();
            services.AddScoped<IJobRepository, JobRepository>();
            services.AddScoped<IPhotoRepository, PhotoRepository>();
            services.AddScoped<IRentRepository, RentRepository>();
            services.AddScoped<IReportRepository, ReportRepository>();
            services.AddScoped<ITenantRepository, TenantRepository>();
            services.AddScoped<IWorkerRepository, WorkerRepository>();
            services.AddScoped<ICountryDSRepository, CountryDSRepository>();
            services.AddScoped<IProvinceDSRepository, ProvinceDSRepository>();
            services.AddScoped<ICityDSRepository, CityDSRepository>();
            services.AddScoped<IOwnerDSRepository, OwnerDSRepository>();

            services.AddScoped<ICountryResolver, CountryResolver>();
            services.AddScoped<CountryResolverService>();

            // Filtros
            //services.AddScoped<MovieExistsAttribute>();

            // Servicios extra

            // Manejo de archivos en el servidor 
            services.AddSingleton<IFileStorage, FileStorageLocal>();
            services.AddHttpContextAccessor();

            // Email Configuration
            var emailConfig = Configuration.GetSection("NotificationEmail").Get<EmailConfiguration>();
            services.AddSingleton(emailConfig);
            services.AddScoped<IEmailSender, EmailSender>();
            services.AddDetection();

            // --------------

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options => options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = false,   // false para desarrollo y pruebas
                ValidateAudience = false, // false para desarrollo y pruebas
                //ValidateIssuer = true,
                //ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(
                    Encoding.UTF8.GetBytes(Configuration["JWT:key"])),
                ClockSkew = TimeSpan.Zero
            });

            // Identity Clase: https://www.udemy.com/course/construyendo-web-apis-restful-con-aspnet-core/learn/lecture/27047608#notes
            services.AddIdentity<BuildyUser, BuildyRole>(options =>
            {
                options.Password.RequireDigit = false;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequiredUniqueChars = 0;
                options.Password.RequireUppercase = false;
                options.Password.RequireLowercase = false;
                options.Password.RequiredLength = 6;
            })
            .AddEntityFrameworkStores<ContextDB>()
            .AddDefaultTokenProviders();

            // Autorización basada en Claims
            // Agregar los roles del sistema
            // Clase: https://www.udemy.com/course/construyendo-web-apis-restful-con-aspnet-core/learn/lecture/27047710#notes
            services.AddAuthorization(options =>
            {
                options.AddPolicy("IsAdmin", policy => policy.RequireClaim("role", "admin"));
            });

            // Configuración CORS: para permitir recibir peticiones http desde un origen específico
            // CORS Sólo sirve para aplicaciones web (Angular, React, etc)
            // Clase: https://www.udemy.com/course/construyendo-web-apis-restful-con-aspnet-core/learn/lecture/27047732#notes
            // apirequest.io
            services.AddCors(options =>
            {
                var frontendURL = Configuration.GetValue<string>("Frontend_URL");
                options.AddDefaultPolicy(builder =>
                {
                    //builder.WithOrigins(frontendURL).AllowAnyMethod().AllowAnyHeader();
                    builder.WithOrigins("*").AllowAnyMethod().AllowAnyHeader();
                    builder.WithExposedHeaders(new string[] { "totalSizeRecords" }); // Permite agregar headers customizados. Clase: https://www.udemy.com/course/construyendo-web-apis-restful-con-aspnet-core/learn/lecture/27148924#notes
                });
            });

            // Clase: https://www.udemy.com/course/construyendo-web-apis-restful-con-aspnet-core/learn/lecture/27148834#notes
            services.AddTransient<GenerateLinks>();
            services.AddSingleton<IActionContextAccessor, ActionContextAccessor>();

            // ApplicationInsights, Clase: https://www.udemy.com/course/construyendo-web-apis-restful-con-aspnet-core/learn/lecture/27187344#notes
            services.AddApplicationInsightsTelemetry(options =>
            {
                options.ConnectionString = Configuration["ApplicationInsights:ConnectionString"];
            });

            services.Configure<RequestLocalizationOptions>(options =>
    {
        var supportedCultures = new[] { new CultureInfo("es-UY") };
        options.DefaultRequestCulture = new RequestCulture("es-UY");
        options.SupportedCultures = supportedCultures;
        options.SupportedUICultures = supportedCultures;
    });

        }

        /// <summary>
        /// Configuración del Middleware
        /// Middlewares son los métodos "Use..()"
        /// </summary>
        /// <param name="app"></param>
        /// <param name="env"></param>
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            // Middleware customizado: https://www.udemy.com/course/construyendo-web-apis-restful-con-aspnet-core/learn/lecture/26839760#notes
            app.UseLogResponseHTTP();
            app.UseRequestLocalization(); // Asegúrate de que esta línea esté antes de app.UseEndpoints

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "Buildy 2.0");
            });

            app.UseHttpsRedirection(); // orden n1
            app.UseStaticFiles();
            app.UseCors(); // orden n2, Clase: https://www.udemy.com/course/construyendo-web-apis-restful-con-aspnet-core/learn/lecture/27047732#notes
            app.UseRouting();  // orden n3
            app.UseAuthentication();
            app.UseAuthorization();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }

    }
}