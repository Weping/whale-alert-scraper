const puppeteer = require('puppeteer')

let browser, page

const scraper = {
  async open() {
    browser = await puppeteer.launch({ headless: true })
    page = await browser.newPage()

    const url = 'https://whale-alert.io/'
    const selector = '.term-container'

    await page.goto(url)
    await page.waitForSelector(selector)
  },
  async runEvents(socket) {

    // Details here https://pptr.dev/#?product=Puppeteer&show=api-pageexposefunctionname-puppeteerfunction
    await page.exposeFunction('emitter', (...data) => {
      socket.emit(...data)
    })

    await page.evaluate(function observeDom() {
      // Details here https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver

      // Select the target node
      var node = document.querySelector('.term-container')
      // Create an observer instance
      var observer = new MutationObserver(function (mutations) {
        // Trigger this event whenever there is a change
        emitter('refresh', node.innerText)
      })

      // Observer configuration
      var config = {
        attributes: true,
        childList: true,
        characterData: true,
        subtree: true
      }

      // Target: node
      // Options: config
      observer.observe(node, config)
    })
  }
}

module.exports = scraper
