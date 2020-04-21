const puppeteer = require('puppeteer');
const { getChrome } = require('./chrome-script');

module.exports.hello = async (event) => {
  const { url } = event.queryStringParameters;
  const chrome = await getChrome();
  const browser = await puppeteer.connect({
    browserWSEndpoint: chrome.endpoint,
  })
  const tab = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  const page = await tab.newPage();
  await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1.5 });
  await page.goto(url, { waitUntil: 'networkidle0' });
  // const content = await page.evaluate(() => document.body.innerHTML); // ! Scaping get content

  const buffer = await page.screenshot({
    type: 'jpeg',
    quality: 60

  });
  const base64Image = buffer.toString('base64');
  // cached.set(url, base64Image);
  // return base64Image;
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        image: base64Image,
        input: event,
      },
      null,
      2
    ),
  };
};
