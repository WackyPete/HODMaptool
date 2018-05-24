using Microsoft.AspNet.Builder;
using Microsoft.AspNet.Hosting;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.Data.Entity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using HODDungeonMaster.Models;
using HODDungeonMaster.Services;
using ThePit.Data.Tools;

namespace HODDungeonMaster
{
    public class Startup
    {
        //One Instance of WORLD!
        public static readonly PitWorldTemplate World = new PitWorldTemplate();

        public Startup(IHostingEnvironment env)
        {
            // Set up configuration sources.
            var builder = new ConfigurationBuilder()
                .AddJsonFile("appsettings.json")
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
                .AddJsonFile("hodaccounts.json")
                .AddJsonFile($"hodaccounts.{env.EnvironmentName}.json", true);

            if (env.IsDevelopment())
            {
                // For more details on using the user secret store see http://go.microsoft.com/fwlink/?LinkID=532709
                builder.AddUserSecrets();
            }

            builder.AddEnvironmentVariables();
            Configuration = builder.Build();
            World.Load(DmConfig.Settings.SavePath, true);
            ActivityLog.FileName = DmConfig.Settings.LogFilePath;
        }

        public static void SaveWorld(bool forceSave)
        {
            lock(World)
            {
                World.SaveChanges(DmConfig.Settings.SavePath, forceSave);
            }
        }

        public IConfigurationRoot Configuration { get; set; }
        
        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // Add framework services.
            services.AddEntityFramework()
                .AddSqlServer()
                .AddDbContext<ApplicationDbContext>(options =>
                    options.UseSqlServer(Configuration["Data:DefaultConnection:ConnectionString"]));

            services.AddIdentity<ApplicationUser, IdentityRole>()
                .AddEntityFrameworkStores<ApplicationDbContext>()
                .AddDefaultTokenProviders();            

            services.ConfigureRouting(route =>
            {
                route.AppendTrailingSlash = true;
                route.LowercaseUrls = true;
            });

            services.AddCaching();
            services.AddSession();
            services.AddMvc();           

            services.Configure<HodAppSettings>(Configuration.GetSection("HodAppSettings"));

            // Add application services.
            services.AddTransient<IEmailSender, AuthMessageSender>();
            services.AddTransient<ISmsSender, AuthMessageSender>();            
        }

        //REQUIRED FOR IIS 8!!!!
        //PREREQUISITES : Must have installed x64 httpPlatForm Handler v1.2  FOR RC1  (RC2+ and Beta8 for CORE.NET requires seperate handlers
        //NOTE: These steps apply to the deployment over file system method NOT Azure
        //Add virtual directory on IIS with apppool. Set app pool to "No Managed Code" and leave as integrated. 
        //Set root path for directory to wwwroot from published project.
        //Set permission for folders using account and IIS_USRS
        //IF SCRIPTS ARE LOADING TWICE... Comment out anything in views/_layout.cshtml that appears to be loading twice.
        //web.config under /wwwroot
        /*
         <configuration>
          <system.webServer>
            <modules runAllManagedModulesForAllRequests="true"/> 
            <handlers>
              <add name="httpplatformhandler" path="*" verb="*" modules="httpPlatformHandler" resourceType="Unspecified" />
            </handlers>
            <httpPlatform processPath="C:\inetpub\hoddm\approot\web.cmd" arguments="" stdoutLogEnabled="true" stdoutLogFile="C:\inetpub\hoddm\logs\stdout.log" startupTimeLimit="3600"></httpPlatform>
          </system.webServer>
         <system.web>
             <httpRuntime relaxedUrlToFileSystemMapping="true" />
          </system.web>
        </configuration>
        */
        //web.config must have absolute paths to the web.cmd and logs
        //Final step, need to change Startup.cs Configure() method to the implementation below:

        //Stub in this "new" Configure() method and pass to old method. Mapping needs to match virtual directory for app created on IIS

        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            app.Map("/hoddm", (app1) => this.Configure1(app1, env, loggerFactory));
        }

        /*
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            app.Map("/hoddmsuper", (app1) => this.Configure1(app1, env, loggerFactory));
        }
        */

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure1(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            //loggerFactory.AddConsole(Configuration.GetSection("Logging"));
            //loggerFactory.AddDebug();
            
            if (env.IsDevelopment())
            {
                app.UseBrowserLink();
                app.UseDeveloperExceptionPage();
                app.UseDatabaseErrorPage();
                app.UseIISPlatformHandler();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
                app.UseIISPlatformHandler();

                // For more details on creating database during deployment see http://go.microsoft.com/fwlink/?LinkID=615859
                try
                {
                    using (var serviceScope = app.ApplicationServices.GetRequiredService<IServiceScopeFactory>()
                        .CreateScope())
                    {
                        serviceScope.ServiceProvider.GetService<ApplicationDbContext>()
                             .Database.Migrate();
                    }
                }
                catch { }
            }
            
            app.UseIISPlatformHandler(options => options.AuthenticationDescriptions.Clear());

            app.UseStaticFiles();

            app.UseIdentity();

            app.UseSession();
            
            // To configure external authentication please see http://go.microsoft.com/fwlink/?LinkID=532715            
            app.UseMvc(routes =>
            {                
                routes.MapRoute(                                        
                    name: "default",                    
                    template: "{controller=Home}/{action=Index}/{id?}");
                routes.MapRoute(
                    name: "Stats",
                    template: "{controller=Home}/{action=Stats}/{id?}/{value?}");
            });
        }

        // Entry point for the application.
        public static void Main(string[] args) => WebApplication.Run<Startup>(args);
    }
}
