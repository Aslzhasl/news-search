const apikey = '0e620bda7d0e4549ab9784b17c4ec59d';
const blogContainer = document.getElementById("blog-container");
const searchField = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');

// Function to fetch top headlines (initial load or without search query)
async function fetchTopHeadlines() {
    try {
        const apiUrl = `https://newsapi.org/v2/top-headlines?country=us&pageSize=10&apiKey=${apikey}`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        return data.articles;
    } catch (error) {
        console.error("Error fetching top headlines", error);
        return [];
    }
}

// Function to fetch news based on search query
async function fetchNewsByQuery(query) {
    try {
        const apiUrl = `https://newsapi.org/v2/everything?q=${query}&pageSize=10&apiKey=${apikey}`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        return data.articles;
    } catch (error) {
        console.error("Error fetching news by query", error);
        return [];
    }
}

// Event listener for search button click
searchButton.addEventListener("click", async () => {
    const query = searchField.value.trim();
    if (query !== "") {
        try {
            const articles = await fetchNewsByQuery(query);
            displayBlogs(articles);
        } catch (error) {
            console.error("Error fetching news by query", error);
        }
    } else {
        // If the search field is empty, fetch top headlines instead
        try {
            const articles = await fetchTopHeadlines();
            displayBlogs(articles);
        } catch (error) {
            console.error("Error fetching top headlines", error);
        }
    }
});

// Function to display news articles
function displayBlogs(articles) {
    blogContainer.innerHTML = "";
    articles.forEach((article) => {
        // Skip articles with "(removed)" as title
        if (article.title.toLowerCase().includes("(removed)")) {
            return;
        }

        const blogCard = document.createElement("div");
        blogCard.classList.add("blog-card");

        const img = document.createElement("img");
        img.src = article.urlToImage || "https://placehold.co/600x400";
        img.alt = article.title || "No image available";
        
        img.onerror = () => {
            img.src = "https://placehold.co/600x400";
        };

        const title = document.createElement("h2");
        const truncatedTitle = article.title && article.title.length > 30 ? article.title.slice(0, 30) + "..." : article.title;
        title.textContent = truncatedTitle;

        const description = document.createElement("p");
        const truncatedDes = article.description && article.description.length > 120 ? article.description.slice(0, 120) + "..." : article.description;
        description.textContent = truncatedDes;

        blogCard.appendChild(img);
        blogCard.appendChild(title);
        blogCard.appendChild(description);
        blogCard.addEventListener('click', () => {
            window.open(article.url, "_blank");
        });

        blogContainer.appendChild(blogCard);
    });
}

// Initial load of top headlines
(async () => {
    try {
        const articles = await fetchTopHeadlines();
        displayBlogs(articles);
    } catch (error) {
        console.error("Error fetching top headlines", error);
    }
})();
