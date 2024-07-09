using Elasticsearch.Net;
using Nest;
using Newtonsoft.Json;
using SimpleRecipeKeeper.Models;

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
            .ServerCertificateValidationCallback(CertificateValidations.AllowAll)
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


    public async Task<RecipeSearchResult> GetRecipesAsync(int page, int pageSize, string filter, string orderBy)
    {
        // Initialize the query
        var query = new SearchDescriptor<Recipe>()
            .From((page - 1) * pageSize)
            .Size(pageSize)
            .Sort(s => s.Ascending(orderBy));

        // Apply the filter if provided
        if (!string.IsNullOrEmpty(filter))
        {
            var filterObj = JsonConvert.DeserializeObject<RecipeFilter>(filter);

            query = query.Query(q => q.Bool(b => 
            {
                var mustQueries = new List<Func<QueryContainerDescriptor<Recipe>, QueryContainer>>();

                if (filterObj.FoodCategories != null && filterObj.FoodCategories.Any())
                {
                    mustQueries.Add(m => m.Terms(t => t.Field(f => f.FoodCategory).Terms(filterObj.FoodCategories)));
                }

                if (filterObj.Ingredients != null && filterObj.Ingredients.Any())
                {
                    mustQueries.Add(m => m.Nested(n => n
                        .Path(p => p.Ingredients)
                        .Query(nq => nq.Bool(nb => nb
                            .Must(mq => mq.Term(t => t.Field(f => f.Ingredients.First().Name).Value(filterObj.Ingredients.First())))))));
                }

                if (filterObj.MaxTime != null && filterObj.MaxTime.HasValue)
                {
                    mustQueries.Add(m => m.Range(r => r.Field(f => f.TotalTimeInMinutes).LessThanOrEquals(filterObj.MaxTime)));
                }

                return b.Must(mustQueries.ToArray());
            }));
        }

        // Serialize query to JSON for debugging
        var requestJson = _client.RequestResponseSerializer.SerializeToString(query);
        System.Console.WriteLine(requestJson);

        var response = await _client.SearchAsync<Recipe>(query);

        if (response.IsValid)
        {
            return new RecipeSearchResult
            {
                TotalCount = response.Total,
                Recipes = response.Documents
            };
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
        .Sort(sort => sort.Descending("id"))
        .Source(source => source
            .Includes(i => i.Field(f => f.Id))
        )
        );

        int newId;
        if (lastDocumentIdResponse.IsValid && lastDocumentIdResponse.Documents.Any())
        {
            newId = lastDocumentIdResponse.Documents.First().Id + 1;
        }
        else
        {
            newId = 1;
        }

        
        recipe.Id = newId;

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
            return recipe;
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

    public async Task<List<Recipe>> SearchRecipesAsync(string searchText)
    {
        var response = await _client.SearchAsync<Recipe>(s => s
            .Query(q => q
                .MultiMatch(m => m
                    .Fields(f => f
                        .Field(ff => ff.Title)
                        .Field(ff => ff.Ingredients)
                        .Field(ff => ff.Instructions)
                    )
                    .Query(searchText)
                    .Fuzziness(Fuzziness.Auto)
                )
            )
        );

        if (response.IsValid)
        {
            return response.Documents.ToList();
        }
        else
        {
            throw new Exception("Failed to search recipes.");
        }
    }

    public async Task<List<string>> GetAllIngredientsAsync()
    {
        var response = await _client.SearchAsync<Recipe>(s => s
            .Size(0)
            .Aggregations(a => a
                .Nested("unique_ingredients", n => n
                    .Path(p => p.Ingredients)
                    .Aggregations(aa => aa
                        .Terms("names", t => t
                            .Field("ingredients.name")
                            .Size(10000)
                        )
                    )
                )
            )
        );

        if (response.IsValid)
        {
            var ingredients = response.Aggregations.Nested("unique_ingredients")
                .Terms("names").Buckets
                .Select(b => b.Key)
                .OrderBy(name => name)
                .ToList();

            return ingredients;
        }
        else
        {
            throw new Exception("Failed to retrieve ingredients.");
        }
    }
}