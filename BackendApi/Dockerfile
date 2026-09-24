# Etapa de compilación
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /app

COPY *.csproj ./
RUN dotnet restore

COPY . ./
RUN dotnet publish -c Release -o out

# Etapa de ejecución
FROM mcr.microsoft.com/dotnet/aspnet:9.0

# Forzar a .NET a usar su propia implementación TLS administrada (Bypassea restricciones estrictas de OpenSSL)
ENV DOTNET_SYSTEM_NET_SECURITY_USE_MANAGED_SSL=true

WORKDIR /app
COPY --from=build /app/out .

# Configurar puerto para Render
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "BackendApi.dll"]