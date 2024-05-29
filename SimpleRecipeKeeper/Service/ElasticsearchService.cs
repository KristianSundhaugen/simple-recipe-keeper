using Nest;
using Microsoft.Extensions.Configuration;
using System;
using System.Net.Security;
using System.Security.Cryptography.X509Certificates;
using Microsoft.Extensions.Logging;

public class ElasticsearchService : IElasticsearchService
{
    private readonly ElasticClient _client;

    public ElasticsearchService(IConfiguration configuration)
    {
        var url = configuration.GetSection("Elasticsearch:Url").Value;
        var user = configuration.GetSection("Elasticsearch:User").Value;
        var password = configuration.GetSection("Elasticsearch:Password").Value;
        var caCertificatePath = configuration.GetSection("Elasticsearch:CaCertificatePath").Value;

        var settings = new ConnectionSettings(new Uri(url))
            .BasicAuthentication(user, password)
            .ServerCertificateValidationCallback((sender, certificate, chain, sslPolicyErrors) =>
            {
                if (sslPolicyErrors == SslPolicyErrors.None)
                    return true;

                if (sslPolicyErrors == SslPolicyErrors.RemoteCertificateChainErrors && chain != null)
                {
                    foreach (var status in chain.ChainStatus)
                    {
                        if (status.Status == X509ChainStatusFlags.UntrustedRoot)
                        {
                            // If the only error is untrusted root, we will check if it matches our CA cert
                            X509Certificate2 caCert = new X509Certificate2(caCertificatePath);
                            if (chain.ChainElements[chain.ChainElements.Count - 1].Certificate.Thumbprint == caCert.Thumbprint)
                            {
                                return true;
                            }
                        }
                    }
                }
                return false;
            })
            .DefaultIndex("recipe")
            .DisableDirectStreaming();  // Enable this to capture request and response

        _client = new ElasticClient(settings);

        // Check connection
        try
        {
            var pingResponse = _client.Ping();
            if (pingResponse.IsValid)
            {
                Console.WriteLine("Connection to Elasticsearch 'recipe' index established successfully.");
            }
            else
            {
                Console.WriteLine("Failed to establish connection to Elasticsearch 'recipe' index.");
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine("Exception while establishing connection to Elasticsearch 'recipe' index.");
        }
    }

    public Task<Recipe> CreateRecipeAsync(Recipe recipe)
    {
        throw new NotImplementedException();
    }

    public Task<bool> DeleteRecipeAsync(string id)
    {
        throw new NotImplementedException();
    }

    public Task<Recipe> GetRecipeAsync(string id)
    {
        throw new NotImplementedException();
    }

    public Task<Recipe> GetRecipeByIdAsync(string id)
    {
        throw new NotImplementedException();
    }

    public async Task<IEnumerable<Recipe>> GetRecipesAsync()
    {
        var response = await _client.SearchAsync<Recipe>(s => s.MatchAll());
        if (response.IsValid)
        {
            return response.Documents;
        }
        else
        {
            throw new Exception("Failed to retrieve recipes.");
        }
    }

    public Task IndexRecipeAsync(Recipe recipe)
    {
        throw new NotImplementedException();
    }

    public Task<Recipe> UpdateRecipeAsync(Recipe recipe)
    {
        throw new NotImplementedException();
    }
}
