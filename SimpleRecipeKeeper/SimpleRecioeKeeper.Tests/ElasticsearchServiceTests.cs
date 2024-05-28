namespace SimpleRecipeKeeper.ElasticsearchServiceTests;

using Moq;
using Nest;
using NUnit.Framework;
using System;
using System.Threading;
using System.Threading.Tasks;

[TestFixture]
public class ElasticsearchServiceTests
{
    private Mock<IElasticClient> _mockElasticClient;
    private IElasticsearchService _elasticsearchService;

    [SetUp]
    public void Setup()
    {
        _mockElasticClient = new Mock<IElasticClient>();
        _mockElasticClient.Setup(x => x.ConnectionSettings).Returns(new ConnectionSettings(new Uri("http://localhost:9200")));
        _elasticsearchService = new ElasticsearchService(_mockElasticClient.Object);
    }

    [Test]
    public async Task CreateRecipeAsync_ShouldIndexRecipe()
    {
        // Arrange
        var recipe = new Recipe { Id = 1, Title = "Test Recipe" };
        var mockResponse = new Mock<IndexResponse>();
        mockResponse.SetupGet(x => x.IsValid).Returns(true);

        _mockElasticClient
            .Setup(x => x.IndexDocumentAsync(It.IsAny<Recipe>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(mockResponse.Object);

        // Act
        var result = await _elasticsearchService.CreateRecipeAsync(recipe);

        // Assert
        Assert.Equals(recipe, result);
        _mockElasticClient.Verify(x => x.IndexDocumentAsync(It.IsAny<Recipe>(), It.IsAny<CancellationToken>()), Times.Once);
    }
}
