const fetch = require("node-fetch");
const cheerio = require("cheerio");

async function scrapingTime() {
  const response = await fetch("https://www.amazon.es/gp/bestsellers/books");
  // Parseamos el HTML y lo cargamos
  const text = await response.text();
  const $ = cheerio.load(text);

  // Usando el $ como si fuera jquery seleccionamos los elementos que nos interesen
  $("ol > li > span > div > span").each(function (i, elm) {
    const bookTitle = $(elm).find("a div").text().trim();
    const bookAuthor = $(elm).find("> div:nth-of-type(1) span").text().trim(); // Empieza en 1 y no 0
    const bookImg = $(elm).find("> a > span > div > img").attr("src");
    const bookHref = $(elm).find("> a").attr("href");
    const bookLink = `https://www.amazon.es${bookHref}`;
    const bookScore = $(elm).find("> div:nth-of-type(2) span").text();
    const bookPrice = $(elm)
      .find("> div:nth-of-type(4) a > span > span")
      .text();

    console.log({
      top: i + 1,
      bookTitle,
      bookAuthor,
      bookImg,
      bookLink,
      bookScore,
      bookPrice,
    });
  });
}

scrapingTime();
