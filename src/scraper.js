const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    const articles = [];

    // Loop through each month from January 2022 to December 2024
    for (let year = 2022; year <= 2024; year++) {
        for (let month = 1; month <= 12; month++) {
            // Construct the URL for the archive
            const url = `https://www.theverge.com/archives/${year}/${month.toString().padStart(2, '0')}`;
            console.log(`Navigating to ${url}...`);
            await page.goto(url);

            // Wait for the page to load
            try {
                await page.waitForSelector('.c-compact-river__entry', { timeout: 60000 }); // Increase timeout to 60 seconds
            } catch (error) {
                console.log(`No articles found for ${year}-${month.toString().padStart(2, '0')}. Skipping...`);
                continue; // Skip to the next month if no articles are found
            }

            console.log(`Scraping titles and links for ${year}-${month.toString().padStart(2, '0')}...`);
            const newArticles = await page.evaluate(() => {
                const nodes = document.querySelectorAll('.c-compact-river__entry');
                return Array.from(nodes).map(node => {
                    const titleNode = node.querySelector('.c-entry-box--compact__title a');
                    const title = titleNode ? titleNode.innerText : '';
                    const link = titleNode ? titleNode.href : null;
                    
                    // Corrected date selector
                    const dateNode = node.querySelector('.c-byline time');
                    const date = dateNode ? dateNode.innerText.trim() : '';
                    return { title, link, date };
                });
            });

            console.log('Number of new articles scraped:', newArticles.length);
            articles.push(...newArticles);
        }
    }

    console.log('Filtering and sorting articles...');
    const filteredArticles = articles.filter(
        article => article.date && new Date(article.date) >= new Date('2022-01-01')
    ).sort((a, b) => new Date(b.date) - new Date(a.date));

    // Saving scraped data
    console.log('Saving scraped data...');
    try {
        fs.writeFileSync(
            path.join(__dirname, '../output/articles.json'),
            JSON.stringify(filteredArticles, null, 2)
        );
        console.log('Data saved to output/articles.json');
    } catch (error) {
        console.error('Error saving data:', error);
    }

    await browser.close();
    console.log('Scraping complete!');
})();