const puppeteer = require("puppeteer");

(async () => {
  try {
    /* Initialize the browser

     We can use the page.$() method to access the Selectors API method querySelector() on the document,
     page.$$() as an alias to querySelectorAll()
     or page.evaluate(callback) to retrieve information  

    */

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto("https://www.nba.com/stats/", [
      "load",
      "domcontentloaded",
      "networkidle0",
    ]);

    //Console listener
    page.on("console", (msg) => {
      for (let i = 0; i < msg._args.length; ++i)
        console.log(`${i}: ${msg._args[i]}`);
    });

    await page.waitForSelector("#onetrust-accept-btn-handler");
    await page.click("#onetrust-accept-btn-handler");
    await page.waitForNavigation();

    //await page.click(".leaders-header__switch");

    await page.evaluate(() => {
      const switchButtons = document.querySelectorAll(
        ".leaders-header__switch"
      );

      const seasonLeadersButton = switchButtons[1].querySelector(
        "a:nth-of-type(2)"
      );

      seasonLeadersButton.click();
    });

    /* Scrap the content

     We can use the page.$() method to access the Selectors API method querySelector() on the document,
     page.$$() as an alias to querySelectorAll()
     or page.$eval(selector, callback) 
     or evaluate() 

    */

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

    await browser.close();
  } catch (error) {
    console.log("Error " + error.toString());
  }
})();
