using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Driver;

var builder = WebApplication.CreateBuilder(args);

// 1. Configuración de CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// 2. LEER CONFIGURACIÓN Y CONECTAR A MONGODB (Compatible con Render y local)
var mongoConnectionString = builder.Configuration.GetConnectionString("MongoDB") 
                            ?? builder.Configuration.GetSection("MongoDbSettings:ConnectionString").Value;
var mongoDatabaseName = builder.Configuration.GetSection("MongoDbSettings:DatabaseName").Value ?? "TestDatabase";

// Registramos el cliente de MongoDB para poder usarlo en toda la app
builder.Services.AddSingleton<IMongoClient>(new MongoClient(mongoConnectionString));

var app = builder.Build();
app.UseCors("AllowReact");

// 3. ENDPOINTS PARA MONGODB
// Obtener todas las tareas
app.MapGet("/tareas", (IMongoClient cliente) =>
{
    var baseDatos = cliente.GetDatabase(mongoDatabaseName);
    var coleccion = baseDatos.GetCollection<Tarea>("Tareas");

    var tareas = coleccion.Find(new BsonDocument()).ToList();
    return Results.Ok(tareas);
});

// Crear una nueva tarea
app.MapPost("/tareas", (IMongoClient cliente, Tarea nuevaTarea) =>
{
    var baseDatos = cliente.GetDatabase(mongoDatabaseName);
    var coleccion = baseDatos.GetCollection<Tarea>("Tareas");

    coleccion.InsertOne(nuevaTarea);
    return Results.Ok(nuevaTarea);
});

// El endpoint del clima por defecto
var summaries = new[] { "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching" };
app.MapGet("/weatherforecast", () =>
{
    return Enumerable.Range(1, 5).Select(index => new WeatherForecast
    (
        DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
        Random.Shared.Next(-20, 55),
        summaries[Random.Shared.Next(summaries.Length)]
    )).ToArray();
});

// ACTUALIZAR una tarea existente (Update)
app.MapPut("/tareas/{id}", (IMongoClient cliente, string id, Tarea tareaActualizada) =>
{
    var baseDatos = cliente.GetDatabase(mongoDatabaseName);
    var coleccion = baseDatos.GetCollection<Tarea>("Tareas");

    var filtro = Builders<Tarea>.Filter.Eq(t => t.Id, id);
    tareaActualizada.Id = id;

    coleccion.ReplaceOne(filtro, tareaActualizada);
    return Results.Ok(tareaActualizada);
});

// BORRAR una tarea (Delete)
app.MapDelete("/tareas/{id}", (IMongoClient cliente, string id) =>
{
    var baseDatos = cliente.GetDatabase(mongoDatabaseName);
    var coleccion = baseDatos.GetCollection<Tarea>("Tareas");

    var filtro = Builders<Tarea>.Filter.Eq(t => t.Id, id);
    coleccion.DeleteOne(filtro);

    return Results.NoContent();
});

app.Run();

// 4. MODELOS DE DATOS
record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}

public class Tarea
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    public string Nombre { get; set; } = null!;
    public bool Completada { get; set; }
}