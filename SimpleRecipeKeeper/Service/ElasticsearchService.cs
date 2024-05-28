using Nest;

public class ElasticsearchService : IElasticsearchService
{
    private readonly ElasticClient _client;

    public ElasticsearchService(IConfiguration configuration)
    {
        var url = configuration.GetSection("Elasticsearch:Url").Value;
        var settings = new ConnectionSettings(new Uri(url)).DefaultIndex("recipe");
        _client = new ElasticClient(settings);
        // Check if the client is not null and connected to Elasticsearch
        if (_client != null && _client.Ping().IsValid)
        {
            Console.WriteLine("Connection to Elasticsearch 'recipe' index established successfully.");
        }
        else
        {
            Console.WriteLine("Failed to establish connection to Elasticsearch 'recipe' index.");
        }
    }

    public ElasticsearchService(IElasticClient client)
    {
        _client = client as ElasticClient ?? throw new ArgumentException("Invalid ElasticClient", nameof(client));
    }

    public async Task IndexRecipeAsync(Recipe recipe)
    {
        var response = await _client.IndexDocumentAsync(recipe);
        if (!response.IsValid)
        {
            // Handle indexing failure
            throw new Exception("Failed to index recipe.");
        }
    }

    public async Task<Recipe> GetRecipeAsync(string id)
    {
        var response = await _client.GetAsync<Recipe>(id);
        if (response.IsValid)
        {
            return response.Source;
        }
        else
        {
            // Handle retrieval failure
            throw new Exception("Failed to retrieve recipe.");
        }
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
            // Handle retrieval failure
            throw new Exception("Failed to retrieve recipes.");
        }
    }

    public async Task<Recipe> GetRecipeByIdAsync(string id)
    {
        var recipe = await GetRecipeAsync(id);
        return recipe;
    }

    public async Task<Recipe> CreateRecipeAsync(Recipe recipe)
    {
        await IndexRecipeAsync(recipe);
        return recipe;
    }

    public async Task<Recipe> UpdateRecipeAsync(Recipe recipe)
    {
        await IndexRecipeAsync(recipe);
        return recipe;
    }

    public async Task<bool> DeleteRecipeAsync(string id)
    {
        var response = await _client.DeleteAsync<Recipe>(id);
        return response.IsValid && response.Result == Result.Deleted;
    }
}
