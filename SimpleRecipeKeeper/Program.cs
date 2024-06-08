var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure Elasticsearch settings
builder.Services.Configure<ElasticsearchService>(builder.Configuration.GetSection("ElasticsearchService"));

// Add Elasticsearch service
builder.Services.AddSingleton<ElasticsearchService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.UseAuthorization();
app.MapControllers(); // Make sure this line is present to map attribute-routed controllers

app.Run();
