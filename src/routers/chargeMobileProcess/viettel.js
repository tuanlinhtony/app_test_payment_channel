require('chromedriver')
const express = require('express')
const async = require('hbs/lib/async')
const axios = require('axios')
const puppeteer = require('puppeteer');
const fs = require('fs')

const otpViettel = {
    transID : "null",
    otp : "null",
    numberPhone: 'null',
    captcha: 'null'
}

//Start - Open puppeteer module and then open new page
const openNewPage = async () => {
     //Start - Await launch Puppeteer
     console.log("await puppeteer.launch();")
     const browser = await puppeteer.launch({
         headless: true,
         defaultViewport: null,
         args: [
            '--window-size=1920,1080',
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-accelerated-2d-canvas',
            '--disable-gpu',
         ]
     })
     console.log("done puppeteer.launch();"); 
     //End - Launch Puppeteer Done!

    console.log("await browser.newPage()")
    const page = await browser.newPage()
    await page.setRequestInterception(true)
    page.on('request', (request) => {
        if ([ 'styleSheet' ,  'font'].indexOf(request.resourceType()) !== -1) {
            request.abort()
        } else {
            request.continue()
        }
    })
    await page._client.send('Emulation.clearDeviceMetricsOverride');
    await page.setRequestInterception(true);
           
    const client = await page.target().createCDPSession();
    await client.send('Network.clearBrowserCookies');
    await client.send('Network.clearBrowserCache');
    await page.setDefaultNavigationTimeout(0);
    console.log("done browser.newPage();")
    return {
        browser: browser,
        page: page
    }
}
//End - Open puppeteer module and then open new page

//Start - Go to login page
const gotoLoginPage = async () => {
    console.log("await page.goto https://viettel.vn/dang-nhap")
    await page.goto(process.env.VIETTEL_DANGNHAP, {waitUntil: 'domcontentloaded'});
    await page.screenshot({ path: 'connect_page.png' });
    console.log("done page.goto https://viettel.vn/dang-nhap;")
}
//End -  Go to login page

//Start - Get element input numberphone and then pass value to it.
const inputNumberPhone = async (page, transaction) => {
    console.log("await Nhập số điện thoại")
    const numberPhone = await transaction.numberPhone
    console.log(numberPhone + " is " + typeof numberPhone)
    try {
        await page.waitForNavigation()
        await page.waitForSelector('input[placeholder="Vui lòng nhập số điện thoại"]')
        await page.type('input[placeholder="Vui lòng nhập số điện thoại"]', numberPhone)
        click_otp_button()
    } catch (error) {
        console.log(error)
    }
    console.log("Done Nhập số điện thoại")
}
//End - Get element input numberphone and then pass value to it.

//Start - Get element button that get OTP login and then click it.
const click_otp_button = async () => {
    console.log("Get element button that get OTP login and then click it.")
    await page.waitForSelector('.auth__des')
    await page.evaluate(() => {
        document.querySelector('.auth__des').firstElementChild.click()
    })
    clearPopUp()
    console.log("Done - Get element button that get OTP login and then click it.")
}
//End - Get element button that get OTP login and then click it.

//Start - Clear popup
const clearPopUp = async () => {
    console.log("Await - Clear popup")
    await page.waitForSelector('div[class="jquery-modal blocker current"]')
    const clickCloseSuccess = await page.$('div[class="jquery-modal blocker current"]')
    await clickCloseSuccess.evaluate((el) => el.style.display = 'none')
    console.log("Done - Clear popup")
}
//End - Get element button that get OTP login and then click it.

//Start - Get element input OTP login and then pass value to it.
const inputOTPLogin = async (page) => {
    console.log("Await fill OTP!")
    if(otpViettel.otp === 'null'){
        console.log("No have OTP yet!")
        setTimeout(() => {
            inputOTPLogin(page)
        }, 5000)
    }else if(otpViettel.otp != 'null'){
        console.log("Fill OTP to: " + "#typepass" + ": " + otpViettel.otp)
        await page.waitForSelector('input[id="typepass"]')
        await page.$('#typepass')
        await page.type('#typepass', otpViettel.otp)
        console.log("Done Nhập OTP")
        click_login_button()
    }  
}
//End - Get element input OTP login and then pass value to it.

//Start - Get element button login and then click it.
const click_login_button = async () => {
    console.log("Await - Get element button login and then click it")
    page.waitForTimeout(3000).then(() => console.log('Waited a second!'))
    await page.evaluate(() => {
        document.querySelector('.auth__btn').firstElementChild.click()
    })
    await page.waitForNavigation()
    console.log("Done - Get element button login and then click it")
}
//End - Get element input OTP login and then pass value to it.

//Start - Close all iframe popup
const hidePopUp = async (page) => {
    console.log("Await - Close all iframe popup")
    page.waitForTimeout(3000).then(() => console.log('Waited a second!'));
    try {
        await page.waitForSelector('.auth__des')
        const hide_fancybox_overlay = await page.$('.sp-fancybox-overlay')
        const hide_fancybox_wrap = await page.$('.sp-fancybox-overlay')
        await hide_fancybox_overlay.evaluate((el) => el.style.display = 'none')
        await hide_fancybox_wrap.evaluate((el) => el.style.display = 'none')
        
    } catch (error) {
        console.log(error)
    }
    console.log("Done - Close all iframe popup")
}
//End - Close all iframe popup

//Start - Navigate to napthe page
const gotoNapthePage = async (page, transaction) => {
    console.log("Await - Navigate to napthe page")
    await page.waitForNavigation()
    const url = page.url()
    console.log(url)
    if(url != 'https://viettel.vn/'){
        console.log("Can't find class: phone, it seems login process is not success yet!")
        setTimeout(()=> {
            gotoNapthePage(page) 
        }, 5000)
    }else{
        
        await page.goto(process.env.VIETTEL_NAPTHE)
        await page.screenshot({ path: 'connect_topupCard_page.png' })
        hidePopUp(page)
        getNewCard(transaction)
        getCaptchaImage(page)
    }
    
    console.log("Done - Navigate to napthe page")
}
//End - Get element input OTP login and then pass value to it.

//Start - Request to API_CAPTHE that get a new card.
const getNewCard = async () => {
    console.log("Await - Request to API_CAPTHE that get a new card")
    axios.post(process.env.API_CAPTHE, {
        "transid" : otpViettel.transID,
        "numberPhone" : otpViettel.numberPhone
    })
        .then(async (response) => {
            console.log(response.data.code)
            console.log("api cap the da tra the")
            scratch_card = response.data.code
            page.waitForTimeout(3000).then(() => console.log('Waited a second for fill scratch-card!'));
            console.log("await Nhập mã thẻ');")
            await page.waitForSelector('input[placeholder="Nhập mã thẻ*"]');
            const inputCard = await page.$('input[placeholder="Nhập mã thẻ*"]');
            await inputCard.click();
            await page.keyboard.type(scratch_card);
            console.log("done Nhập mã thẻ")  
        })
    .catch((error) => {
        console.log(error)
    })  
    console.log("Done - Request to API_CAPTHE that get a new card")
}
//End - Request to API_CAPTHE that get a new card..

//Start - Get element captcha that take screenshot of captcha to send 2captcha.
const getCaptchaImage = async (page) => {
    console.log("Await - Get element captcha that take screenshot of captcha to send 2captcha.")
    page.waitForTimeout(10000).then(() => console.log('Waited a second for fill scratch-card!'));
    console.log('Await Get captcha image')
    await page.waitForSelector('.form-capcha')         
    const element = await page.$('.form-capcha')  
    const bounding_box = await element.boundingBox()
    await element.screenshot({
        path: 'capcha__images.png',
        clip: {
            x: bounding_box.x,
            y: bounding_box.y,
            width: 500,
            height: 100,
            },
    })
    sendCaptcha(page)
    console.log("Done - Get element captcha that take screenshot of captcha to send 2captcha.")
}
//End - Get element captcha that take screenshot of captcha to send 2captcha.

//Start - Send captcha_image.png to 2captcha.
const sendCaptcha = async (page) => {
    console.log("Await - Get element captcha that take screenshot of captcha to send 2captcha.")
    const FormData = require('form-data')
    const form = new FormData()
    form.append('key', '57b22ed4aa5d617c850b2754b402f876')
    form.append('method', 'post')
    form.append('file', fs.createReadStream('capcha__images.png'))
    form.append('phrase', 0)
    form.append('regsense', 1)
    form.append('numeric', 4)
    form.append('calc', 0)
    form.append('min_len', 4)
    form.append('max_len', 4)
    form.append('language', 2)
    form.append('pingback', 'https://beeceptor.com/console/api-capthe')
    form.append('json', 1)

    // send image captcha to api decrypt captcha
    axios.post(process.env.SEND_CAPTCHA, 
        form,
        {headers: form.getHeaders()}
        )
      .then(function (response) {
        console.log(response.data.request);
        otpViettel.captcha = response.data.request
        getResultCaptcha(page)
    })
      .catch(function (error) {
        console.log(error);
    });
    
    console.log("Done - Get element captcha that take screenshot of captcha to send 2captcha.")
}
//End - Get element captcha that take screenshot of captcha to send 2captcha.

//Start - Get result captcha from 2captcha.
const getResultCaptcha = async (page) => {
    console.log("Await - Get result captcha from 2captcha..")
    axios.get(process.env.GET_CAPTCHA, {
        params: {
            key : '57b22ed4aa5d617c850b2754b402f876',
            action : 'get',
            id: otpViettel.captcha,
            json: 1
        }
    })
    .then(async (response) => {
            console.log("Get captcha result from to http://2captcha.com/res.php " + response.data.request)
            let captchaResult = response.data.request
            console.log(captchaResult)
            console.log("Done Get Result")
            if(captchaResult === 'CAPCHA_NOT_READY'){
                setTimeout(() => {
                    getResultCaptcha(page)
                }, 10000)
            }else if(captchaResult != 'CAPCHA_NOT_READY'){
                fillCaptcha(page, captchaResult)
            }
          
    })
   
    console.log("Done - Get result captcha from 2captcha.")
}
//End - Get element captcha that take screenshot of captcha to send 2captcha.

//Start - Fill captcha.
const fillCaptcha = async (page, captchaResult) => {
    console.log("Await - Request to API_CAPTHE that get a new card")
    await page.waitForSelector('input[placeholder="Nhập mã bảo mật*"]');
    const inputCapcha = await page.$('input[placeholder="Nhập mã bảo mật*"]');
    await inputCapcha.click();
    await page.keyboard.type(captchaResult);
    await page.evaluate(() => {
        document.querySelector('.payment-online__btn-2column').lastElementChild.click()
    });
    try {
        if(await page.$('.notify-error')){
            await page.waitForSelector('div[class="modal__header custom-modal"]')
            const inputCapcha = await page.$('.custom-modal');
            await inputCapcha.click();
            getCaptchaImage(page)
        }else if(await page.$('.notify-success')){
            await browser.close()
        }
        
    } catch (error) {
        console.log(error)
    }

 
    console.log("Done - Request to API_CAPTHE that get a new card")
}
//End - Fill captcha.


//Start - Process for create new transaction that top up scratch card to phone number
const viettelProcess = async (transaction, callback) => {
        otpViettel.transID = transaction.transid
        otpViettel.numberPhone = transaction.numberPhone
        //Step 1 - Open puppeteer module and then open new page
        const newPage = await openNewPage() 
        page = newPage.page
        //End Step-1

        //Step 2 - go to https://viettel.vn/dang-nhap
        gotoLoginPage(page)
        //End Step-2

        //Step 3 - Get element input numberphone and then pass value to it.
        inputNumberPhone(page, transaction)
        //End Step-3

        //Step 4 - Get element input OTP login and then pass value to it.
        inputOTPLogin(page)
        //End Step-4

        //Step 5 - Navigate to napthe page
        gotoNapthePage(page, transaction) 
        
        //End Step-5

}
//Start - Process for create new transaction that top up scratch card to phone number

module.exports = {
    otpViettel,
    viettelProcess
}

