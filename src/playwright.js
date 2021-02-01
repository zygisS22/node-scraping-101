const playwright = require("playwright");

async function main() {
  const browser = await playwright.webkit.launch({
    headless: false,
  });

  const page = await browser.newPage();
  // Tell the tab to navigate to the JavaScript topic page.
  await page.goto("https://www.nba.com/stats/", [
    "load",
    "domcontentloaded",
    "networkidle0",
  ]);

  const teamStats = await page.evaluate(() => {
    // NodeList Browser API not Javascript API convert to Array
    const statsSections = Array.from(
      document.querySelectorAll("#season_leaders .leaders-body > section")
    ).slice(9);

    const stats = statsSections.map((category) => {
      const title = category.querySelector(".category-header > h2 > a > span")
        .innerText;

      const body = Array.from(
        category.querySelectorAll(".category-body > table > tbody > tr")
      );

      const categoryStats = body.map((row, i) => {
        const team = row.querySelector(".category-table__text > a").innerText;
        const value = row.querySelector(".category-table__value").innerText;

        return {
          position: i + 1,
          team,
          value,
        };
      });

      return {
        category: title,
        scores: categoryStats,
      };
    });

    return stats;
  });

  console.log("stats", teamStats);

  await browser.close();
}

main();
