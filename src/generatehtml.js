const fs = require('fs');
const path = require('path');

console.log('Generating HTML...');
const articlesPath = path.join(__dirname, '../output/articles.json');
const outputPath = path.join(__dirname, '../output/index.html');

if (!fs.existsSync(articlesPath)) {
    console.error('Error: articles.json not found! Please run scraper.js first.');
    process.exit(1);
}

const articles = JSON.parse(fs.readFileSync(articlesPath, 'utf8'));

const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>The Verge Articles</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background: #fff;
            color: #000;
            margin: 2rem;
        }
        h1 {
            text-align: center;
        }
        ul {
            list-style: none;
            padding: 0;
        }
        li {
            margin: 1rem 0;
        }
        a {
            text-decoration: none;
            color: #000;
        }
        a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <h1>The Verge Articles</h1>
    <ul>
        ${articles.map(article => `<li><a href="${article.link}" target="_blank">${article.title}</a></li>`).join('')}
    </ul>
</body>
</html>`;

fs.writeFileSync(outputPath, html);
console.log('HTML generation complete! File saved to output/index.html.');
