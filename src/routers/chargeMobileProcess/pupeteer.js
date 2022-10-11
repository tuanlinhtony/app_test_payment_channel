const {Builder, By, Key, until} = require('selenium-webdriver')
require('chromedriver')
const express = require('express')
const async = require('hbs/lib/async')
const axios = require('axios')
const puppeteer = require('puppeteer');
const fs = require('fs')

const otpViettel = {
    transID : "testNapthe",
    otp : "null"
}

const 
const viettelSlowCharge = async (transaction, callback) => {
        try {
            //Start - Await launch Puppeteer
            console.log("Don't have any OTP yet")
            // 0984263990
            console.log("await puppeteer.launch();")
            const browser = await puppeteer.launch({
                headless: false,
                defaultViewport: null,
                args: [
                    '--window-size=1920,1080',
                    // '--no-sandbox',
                    // '--disable-setuid-sandbox'
                ]
            });
            console.log("done puppeteer.launch();");
            //End - Launch Puppeteer Done!

            //
            console.log("await browser.newPage();")
            const page = await browser.newPage();
            await page.setRequestInterception(true);
            page.on('request', (request) => {
                if (['image', 'styleSheet' ,  'font'].indexOf(request.resourceType()) !== -1) {
                    request.abort();
                } else {
                    request.continue();
                }
            });
            await page._client.send('Emulation.clearDeviceMetricsOverride');
            await page.setRequestInterception(true);
           
            const client = await page.target().createCDPSession();
            await client.send('Network.clearBrowserCookies');
            await client.send('Network.clearBrowserCache');
            await page.setDefaultNavigationTimeout(0);
            console.log("done browser.newPage();")

            console.log("await page.goto https://viettel.vn/dang-nhap")
            
            await page.goto(process.env.VIETTEL_DANGNHAP);
            await page.screenshot({ path: 'connect_page.png' });
            console.log("done page.goto https://viettel.vn/dang-nhap;")

            // console.log("await waitForSelector('a[class=auth__noti-link]');")
            // await page.waitForSelector('a[class=auth__noti-link]');
            // const auth_noti_link = await page.$('.auth__noti-link');
            // await auth_noti_link.click();
            // console.log("await waitForSelector('a[class=auth__noti-link]');")

            let numberPhone = transaction.numberPhone
            console.log("await Nhập số điện thoại');")
            const tab_mobile = await page.$('#tab-mobile');
            await page.waitForSelector('input[placeholder="Vui lòng nhập số điện thoại"]');
            const inputNumberPhone = await page.$('input[placeholder="Vui lòng nhập số điện thoại"]');
            await inputNumberPhone.click();
            await page.keyboard.type(numberPhone);
            console.log("done Nhập số điện thoại;")

            console.log("Await Lấy mã OTP');")
            page.waitForTimeout(3000).then(() => console.log('Waited a second!'));
            await page.evaluate(() => {
                document.querySelector('.auth__des').firstElementChild.click();
              });
            console.log("Done Lấy mã OTP")

            console.log("Await Click button tắt popup thông báo sau khi get OTP');")
            page.waitForTimeout(3000).then(() => console.log('Waited a second!'));
            await page.waitForSelector('div[class="jquery-modal blocker current"]');
            const clickCloseSuccess = await page.$('div[class="jquery-modal blocker current"]');
            await clickCloseSuccess.evaluate((el) => el.style.display = 'none');
            console.log("Done Click button tắt popup thông báo sau khi get OTP');")
            
            setTimeout(async() => {
                console.log("Await Nhập OTP');")
                console.log("Otp came: " + otpViettel.otp);
                const otp = otpViettel.otp;
                console.log("Wake up....");
                console.log("Await fill OTP!");
                console.log("Fill OTP to: " + "#typepass" + ": " + otp)
                await page.waitForSelector('input[id="typepass"');
                const inputOTP = await page.$('#typepass');
               
                await inputOTP.click();
                await page.keyboard.type(otp);
                console.log("Done Nhập OTP');")

                console.log("Await Click button Đăng Nhập');")
                page.waitForTimeout(3000).then(() => console.log('Waited a second!'));
                await page.evaluate(() => {
                    document.querySelector('.auth__btn').firstElementChild.click();
                });
                console.log("Done Click button Đăng Nhập")

                
                page.waitForTimeout(5000).then(() => console.log('Waited a second!'));
                await page.waitForSelector('i[id="checklogking_click_tk_goc"');
                const checklogking_click_tk_goc = await page.$('#checklogking_click_tk_goc');
                

                // Start - navigate to napthe page and solve input field mathe and captcha
                if(checklogking_click_tk_goc != null){
                    page.waitForTimeout(5000).then(() => console.log('Waited a second!'))
                    console.log("await process nap-the")
                   
                    await page.goto(process.env.VIETTEL_DANGNHAP);
                   
                    await page.screenshot({ path: 'connect_topupCard_page.png' });

                    // call api cap the
                     setTimeout(async () => {
                        console.log("call api cap the")
                        axios.post(process.env.API_CAPTHE, {"transID" : "test"})
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
                        
                    }, 2000)
                    
                    console.log("Await Get captcha then send api decrypt captcha")
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
                    console.log('Done Get captcha image')
                    
                    console.log('Await Create data for the request to  2captcha')
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
                    console.log('Done Create data for the request to  2captcha')    

                    // send image captcha to api decrypt captcha
                    axios.post(process.env.SEND_CAPTCHA, form, { headers: form.getHeaders() })
                        .then(async (response) => {
                            page.waitForTimeout(5000).then(() => console.log('Waited 5 second!'))

                            console.log("Captcha sent to http://2captcha.com/in.php with " + response.data.request)

                            console.log('Await Create data object for get result from 2captcha')
                            
                            const startTime = performance.now()
                            setTimeout(async () => {
                                axios.get(process.env.GET_CAPTCHA, {
                                    params: {
                                        key : '57b22ed4aa5d617c850b2754b402f876',
                                        action : 'get',
                                        id: response.data.request,
                                        json: 1
                                    }
                                })
                                .then(async (response) => {
                                        console.log("Get captcha result from to http://2captcha.com/res.php " + response.data.request)
                                        let captchaResult = response.data.request
                                        console.log(captchaResult)
                                        console.log("Done Get Result")
                                        await page.waitForSelector('input[placeholder="Nhập mã bảo mật*"]');
                                        const inputCapcha = await page.$('input[placeholder="Nhập mã bảo mật*"]');
                                        await inputCapcha.click();
                                        await page.keyboard.type(captchaResult);

                                        await page.evaluate(() => {
                                            document.querySelector('.payment-online__btn-2column').lastElementChild.click()
                                        });

                                })
                                .catch((error) => {
                                    console.log(error)
                                })
                                const endTime = performance.now()
                                console.log(`Done Get Result ${endTime - startTime} milliseconds`)
                            }, 40000)
                    })
                    .catch((error) => {
                        console.log(error)
                    })   
                    console.log("done Get captcha then send api decrypt captcha")
                }
                else{
                        console.log("Khong the truy cap trang https://viettel.vn/nap-the")
                   
                }
                console.log("Done process nap-the")
                // Start - navigate to napthe page and solve input field mathe and captcha

            }, 60000)
        } catch (error) {
            console.log(error.message)  
        }
}

module.exports = {
    otpViettel,
    viettelSlowCharge
}

