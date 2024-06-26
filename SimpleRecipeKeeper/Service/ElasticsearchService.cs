using Nest;

public class ElasticsearchService : IElasticsearchService
{
    private readonly ElasticClient _client;

    public ElasticsearchService(IConfiguration configuration)
    {
        var url = configuration.GetSection("Elasticsearch:Url").Value;
        var user = configuration.GetSection("Elasticsearch:User").Value;
        var password = configuration.GetSection("Elasticsearch:Password").Value;

        var settings = new ConnectionSettings(new Uri(url))
            .BasicAuthentication(user, password)
            .DefaultIndex("recipe")
            .DisableDirectStreaming();

        _client = new ElasticClient(settings);

        try
        {
            var pingResponse = _client.Ping();
            if (pingResponse.IsValid)
            {
                Console.WriteLine("Connection to Elasticsearch 'recipe' index established successfully.");
            }
            else
            {
                Console.WriteLine($"Failed to establish connection to Elasticsearch 'recipe' index: {pingResponse.OriginalException.Message}");
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Exception while establishing connection to Elasticsearch 'recipe' index: {ex.Message}");
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
            throw new Exception("Failed to retrieve recipes.");
        }
    }

    public async Task<Recipe> GetRecipeByIdAsync(string id)
    {
        var response = await _client.GetAsync<Recipe>(id);
        if (response.IsValid)
        {
            return response.Source;
        }
        else
        {
            throw new Exception($"Failed to retrieve recipe with ID: {id}.");
        }
    }

    public async Task<Recipe> CreateRecipeAsync(Recipe recipe)
    {
        var lastDocumentIdResponse = await _client.SearchAsync<Recipe>(s => s
        .Size(1)
        .Sort(sort => sort.Descending("_id")) // Sort by descending ID to get the last document
        .Source(source => source
            .Includes(i => i.Field(f => f.Id)) // Only include the ID field in the response
        )
    );

        int newId;
        if (lastDocumentIdResponse.IsValid && lastDocumentIdResponse.Documents.Any())
        {
            // Increment the last document ID to generate the new ID
            newId = lastDocumentIdResponse.Documents.First().Id + 1;
        }
        else
        {
            // If there are no documents in the index, start with ID = 1
            newId = 1;
        }

        // Set the new ID for the recipe
        recipe.Id = newId;

        // Index the recipe with the new ID
        var response = await _client.IndexDocumentAsync(recipe);
        if (response.IsValid)
        {
            return recipe;
        }
        else
        {
            throw new Exception($"Failed to create recipe.");
        }

    }

    public async Task<bool> DeleteRecipeAsync(string id)
    {
        var response = await _client.DeleteAsync<Recipe>(id);
        return response.IsValid;
    }

    public async Task<Recipe> UpdateRecipeAsync(Recipe recipe)
    {
        var response = await _client.UpdateAsync<Recipe>(recipe.Id.ToString(), u => u.Doc(recipe).RetryOnConflict(3));
        if (response.IsValid)
        {
            var updatedResponse = await _client.GetAsync<Recipe>(recipe.Id.ToString());
            if (updatedResponse.IsValid)
            {
                return updatedResponse.Source;
            }
            else
            {
                throw new Exception($"Failed to retrieve updated recipe with ID: {recipe.Id}.");
            }
        }
        else
        {
            throw new Exception($"Failed to update recipe with ID: {recipe.Id}.");
        }
    }



    public async Task IndexRecipeAsync(Recipe recipe)
    {
        var response = await _client.IndexDocumentAsync(recipe);
        if (!response.IsValid)
        {
            throw new Exception($"Failed to index recipe.");
        }
    }
}
