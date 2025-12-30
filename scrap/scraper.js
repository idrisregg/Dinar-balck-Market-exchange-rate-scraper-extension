import puppeteer from "puppeteer";

let cachedData = null;
let lastFetch = null;
const CACHE_DURATION = 5 * 60 * 1000;
let browser = null;

async function getBrowser() {
  if (!browser) {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
  }
  return browser;
}

export default async function scrapeRates() {
  if (cachedData && lastFetch && Date.now() - lastFetch < CACHE_DURATION) {
    return { ...cachedData, cached: true };
  }

  const url = "http://www.forexalgerie.com/";
  let page = null;

  try {
    const browserInstance = await getBrowser();
    page = await browserInstance.newPage();
    
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
    
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    
    await page.waitForSelector('#eurBuy', { timeout: 15000 });
    
    await page.waitForFunction(
      () => {
        const element = document.querySelector('#eurBuy');
        return element && element.textContent.trim() !== '';
      },
      { timeout: 15000 }
    );

    const rates = await page.evaluate(() => {
      const getRate = (id) => {
        const element = document.querySelector(`#${id}`);
        if (!element) return null;
        const text = element.textContent.trim();
        const rate = Number(text.replace(/[^\d.]/g, ""));
        return isNaN(rate) || rate <= 0 ? null : rate;
      };

      return {
        eurBuy: getRate('eurBuy'),
        eurSell: getRate('eurSell'),
        usdBuy: getRate('usdBuy'),
        usdSell: getRate('usdSell'),
        cadBuy: getRate('cadBuy'),
        cadSell: getRate('cadSell')
      };
    });

    const missingRates = Object.entries(rates)
      .filter(([key, value]) => value === null)
      .map(([key]) => key);

    if (missingRates.length > 0) {
      console.warn("Missing or invalid rates:", missingRates);
    }

    const result = {
      rates,
      market: "black",
      source: "forexalgerie.com",
      updatedAt: new Date().toISOString(),
      cached: false
    };

    cachedData = result;
    lastFetch = Date.now();

    return result;

  } catch (err) {
    console.error("Scraping failed:", {
      message: err.message,
      url,
      timestamp: new Date().toISOString()
    });
    
    if (cachedData) {
      console.warn("Returning stale cached data");
      return { ...cachedData, cached: true, stale: true };
    }
    
    return null;
  } finally {
    if (page) {
      await page.close();
    }
  }
}

export function clearCache() {
  cachedData = null;
  lastFetch = null;
}

export async function closeBrowser() {
  if (browser) {
    await browser.close();
    browser = null;
  }
}