using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Driver;

var builder = WebApplication.CreateBuilder(args);

// 1. Configuración de CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "https://mi-proyecto-react-crud.vercel.app")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// 2. LEER CONFIGURACIÓN Y CONECTAR A MONGODB CON SSL EXPLICITO
var mongoConnectionString = builder.Configuration.GetConnectionString("MongoDB") 
                          ?? builder.Configuration.GetSection("MongoDbSettings:ConnectionString").Value;
var mongoDatabaseName = builder.Configuration.GetSection("MongoDbSettings:DatabaseName").Value ?? "TestDatabase";

// Configuración robusta para prevenir fallos de SSL/TLS en entornos Linux (Render)
var settings = MongoClientSettings.FromConnectionString(mongoConnectionString);
settings.SslSettings = new SslSettings { CheckCertificateRevocation = false };

// Registramos el cliente de MongoDB configurado para toda la app
builder.Services.AddSingleton<IMongoClient>(new MongoClient(settings));

var app = builder.Build();

// ¡IMPORTANTE! UseCors debe ir aquí, antes de los endpoints para evitar bloqueos y errores 404
app.UseCors("AllowReact");

// 3. ENDPOINTS PARA MONGODB

// Obtener todos los clientes
app.MapGet("/clientes", (IMongoClient cliente) =>
{
    var baseDatos = cliente.GetDatabase(mongoDatabaseName);
    var coleccion = baseDatos.GetCollection<Cliente>("Clientes");

    var clientes = coleccion.Find(new BsonDocument()).ToList();
    return Results.Ok(clientes);
});

// Crear un nuevo cliente
app.MapPost("/clientes", (IMongoClient cliente, Cliente nuevoCliente) =>
{
    var baseDatos = cliente.GetDatabase(mongoDatabaseName);
    var coleccion = baseDatos.GetCollection<Cliente>("Clientes");

    coleccion.InsertOne(nuevoCliente);
    return Results.Created($"/clientes/{nuevoCliente.Id}", nuevoCliente);
});

// >>> ENDPOINT PARA PRODUCTOS <<<
app.MapGet("/productos", (IMongoClient cliente) =>
{
    var baseDatos = cliente.GetDatabase(mongoDatabaseName);
    var coleccion = baseDatos.GetCollection<Producto>("Productos");

    var productos = coleccion.Find(new BsonDocument()).ToList();
    return Results.Ok(productos);
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

// ACTUALIZAR un cliente existente (Update)
app.MapPut("/clientes/{id}", (IMongoClient cliente, string id, Cliente clienteActualizado) =>
{
    var baseDatos = cliente.GetDatabase(mongoDatabaseName);
    var coleccion = baseDatos.GetCollection<Cliente>("Clientes");

    var filtro = Builders<Cliente>.Filter.Eq(c => c.Id, id);
    clienteActualizado.Id = id;

    coleccion.ReplaceOne(filtro, clienteActualizado);
    return Results.Ok(clienteActualizado);
});

// BORRAR un cliente (Delete)
app.MapDelete("/clientes/{id}", (IMongoClient cliente, string id) =>
{
    var baseDatos = cliente.GetDatabase(mongoDatabaseName);
    var coleccion = baseDatos.GetCollection<Cliente>("Clientes");

    var filtro = Builders<Cliente>.Filter.Eq(c => c.Id, id);
    coleccion.DeleteOne(filtro);

    return Results.NoContent();
});

// ACTUALIZAR un producto existente (Update)
app.MapPut("/productos/{id}", (IMongoClient cliente, string id, Producto productoActualizado) =>
{
    var baseDatos = cliente.GetDatabase(mongoDatabaseName);
    var coleccion = baseDatos.GetCollection<Producto>("Productos");

    var filtro = Builders<Producto>.Filter.Eq(p => p.Id, id);
    productoActualizado.Id = id;

    coleccion.ReplaceOne(filtro, productoActualizado);
    return Results.Ok(productoActualizado);
});

// CREAR un nuevo producto (POST)
app.MapPost("/productos", (IMongoClient cliente, Producto nuevoProducto) =>
{
    var baseDatos = cliente.GetDatabase(mongoDatabaseName);
    var coleccion = baseDatos.GetCollection<Producto>("Productos");

    coleccion.InsertOne(nuevoProducto);
    return Results.Created($"/productos/{nuevoProducto.Id}", nuevoProducto);
});

// ELIMINAR un producto por ID (DELETE)
app.MapDelete("/productos/{id}", (IMongoClient cliente, string id) =>
{
    var baseDatos = cliente.GetDatabase(mongoDatabaseName);
    var coleccion = baseDatos.GetCollection<Producto>("Productos");

    var filtro = Builders<Producto>.Filter.Eq(p => p.Id, id);
    var resultado = coleccion.DeleteOne(filtro);

    if (resultado.DeletedCount == 0)
        return Results.NotFound();

    return Results.NoContent();
});

app.Run();

// 4. MODELOS DE DATOS
record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}

public class Cliente
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("nombre")]
    public string Nombre { get; set; } = null!;

    [BsonElement("completada")]
    public bool Completada { get; set; }
}

public class Producto
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("nombre")]
    public string Nombre { get.set; } = null!;

    [BsonElement("precio")]
    public decimal Precio { get; set; }

    [BsonElement("completada")]
    public bool Completada { get; set; }
}