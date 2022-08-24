const { Cluster } = require('puppeteer-cluster');
(async () => {
  const cluster = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_CONTEXT,
    maxConcurrency: 256,
  });
  await cluster.task(async ({ page, data: { url, id } }) => {
    await page.goto(url, {
      waitUntil: 'networkidle2',
    });
    await page.waitForSelector('.swal-content__input');
    await page.type('.swal-content__input', `Test${id}`);

    await page.waitForSelector('.swal-button--confirm');
    await page.click('.swal-button--confirm');

    for (let i = 0; i < 2; i++) {
      let btn = `swal-button swal-button--${Math.floor(Math.random() * 4)}`
      await page.waitForSelector(btn);
      await page.click(btn);
    }
  });

  for (let i = 0; i < 50; i++) {
    cluster.queue({ url: 'https://quiz.xyz.day', id: i });
  }

  await cluster.idle();
  await cluster.close();
})();
