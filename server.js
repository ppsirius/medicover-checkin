
const puppeteer = require('puppeteer')
require('dotenv').config()

const user = {
  login: process.env.LOGIN,
  password: process.env.PASSWORD
}

const medicoverSite = 'https://mol.medicover.pl/Users/Account/AccessDenied'

async function init() {
  const browser = await puppeteer.launch({headless: false})
  const page = await browser.newPage()
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));

  await page.setViewport({ width: 1670, height: 939 })
  const navigationPromise = page.waitForNavigation()

  await page.goto(medicoverSite, {waitUntil: 'load'})

  // Popup login
  browser.on('targetcreated',async function () {
    const pageList = await browser.pages();
    const page = pageList[pageList.length - 1];
    await page.waitFor(1000);
    await page.waitForSelector('#username-email')
    await page.type('#username-email', user.login)
    await page.type('#password', user.password)
    await page.click('.btn-primary')
  });


  await page.click('#oidc-submit')
  await page.waitFor(8000);


  // Disable ad popup
  await page.click('.modal-footer > .btn')
  await page.waitFor(3000);

  // Umów wizyte
  await page.click('.start-page-nav > .nav-link > a')

  await navigationPromise

  // Wybór wizyty
  await page.waitForSelector('#main-menu > .col-sm-4 > #simplecases > #simplecases-otherproblem > .btn')
  await page.click('#main-menu > .col-sm-4 > #simplecases > #simplecases-otherproblem > .btn')

  await navigationPromise

  await page.waitFor(8000);

  // Wybór centrum
  // Otworzenie dropdowna
  await page.waitForSelector('.col-sm-6 > .form-group > .ng-pristine > .dropdown > .dropdown-toggle')
  await page.click('.col-sm-6 > .form-group > .ng-pristine > .dropdown > .dropdown-toggle')

  // Wybranie centrum
  await page.waitForSelector('.dropdown > .dropdown-menu > .dropdown-item:nth-child(3) > span > span')
  await page.click('.dropdown > .dropdown-menu > .dropdown-item:nth-child(3) > span > span')

  // await page.waitForSelector('.ng-pristine > .row > .col-sm-6:nth-child(3) > .form-group > .form-control')
  // await page.click('.ng-pristine > .row > .col-sm-6:nth-child(3) > .form-group > .form-control')

  await page.waitFor(1000);
  await page.waitForSelector('#advancedSearchForm > .ng-valid > .row > .col-sm-2 > .btn')
  await page.click('#advancedSearchForm > .ng-valid > .row > .col-sm-2 > .btn')


  await page.waitFor(1000);

  await page.waitForSelector('app-slot:nth-child(2) > .freeSlot > .row > .col-xs-12 > .btn')
  await page.click('app-slot:nth-child(2) > .freeSlot > .row > .col-xs-12 > .btn')

  await navigationPromise

  await page.waitForSelector('.visit-content #bookAppointmentButton')
  await page.click('.visit-content #bookAppointmentButton')

  await navigationPromise



  // await browser.close()

}

init()