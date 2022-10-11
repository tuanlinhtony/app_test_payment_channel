const {Builder, By, Key, until} = require('selenium-webdriver')
require('chromedriver')
const express = require('express')
const async = require('hbs/lib/async')
const axios = require('axios')
const puppeteer = require('puppeteer');

const otpMobifone = {
    transID : "testNapthe",
    otp : ""
}

const mobifoneProcess = async (transaction, callback) => {
        try {
            
            console.log("Don't have any OTP yet")
            // 0787703994
            
            console.log("await puppeteer.launch();")
            const browser = await puppeteer.launch({
                headless: false
            });
            
            console.log("done puppeteer.launch();");

            console.log("await browser.newPage();")
            const page = await browser.newPage();
            const client = await page.target().createCDPSession();
            await client.send('Network.clearBrowserCookies');
            await client.send('Network.clearBrowserCache');
            await page.setViewport( { 'width' : 1024, 'height' : 768 } );
            await page.setDefaultNavigationTimeout(0);
            console.log("done browser.newPage();")

            console.log("await page.goto;")
            await page.goto('https://www.mobifone.vn/tai-khoan/dang-nhap-nhanh?referal=http%3A%2F%2Fwww.mobifone.vn');
            await page.screenshot({ path: 'connect_page.png' });
            console.log("done page.goto;")

            console.log("await waitForSelector('span[class=login-otp-icon]');")
            await page.waitForSelector('span[class=login-otp-icon]');
            const login_otp = await page.$('.login-otp-icon');
            await login_otp.click();
            console.log("done waitForSelector('span[class=login-otp-icon]');")

            console.log("await page.$eval('#phone_input', el => el.value = transaction.numberPhone);")
            numberPhone = transaction.numberPhone;
            console.log("numberPhone: " + numberPhone);
            await page.waitForNavigation();
            await page.waitForSelector('input[id=phone_input]');
            // await page.$eval('#phone_input', (el, numberPhone) => el.value = numberPhone);
            await page.$eval('#phone_input', (el, numberPhone) => {
                console.log(el, numberPhone);
                return el.value = numberPhone;
            }, numberPhone);
            await page.screenshot({ path: 'fill_numberphone.png' });
            console.log("done page.$eval('#phone_input', el => el.value = transaction.numberPhone);")

            console.log("await page.$('#check-otp');")
            const check_otp = await page.$('#check-otp');
            await check_otp.click();
            console.log("done check_otp.click();")

            console.log("await waitForSelector('form[id=do-login-form];")
            await page.waitForSelector('form[id=do-login-form]');
            await page.screenshot({ path: 'click_send_numberphone.png' });
            console.log("done waitForSelector('form[id=do-login-form];")
            console.log("Sleeping....");
            setTimeout(async () => {
                console.log("Otp came: " + otpprocessChargeMobileMoney.otp);
                const otpValue = otpprocessChargeMobileMoney.otp;
                console.log("Wake up....");
                console.log("Await fill OTP!"); 
                for (let i = 0; i < otpValue.length; i++) {
                    let otp = otpValue[i]
                    let phone_input = '#digit-'+ (i+1).toString();
                    console.log("Fill OTP to: " + phone_input + ": " + otp)
                    const check_otp = await page.$(phone_input);
                    await check_otp.click();
                    await page.keyboard.type(otp);
                }
                console.log("Fill OTP done!"); 
                console.log("waitForSelector('a[id=do-login]"); 
                // await page.waitForSelector('a[id=do-login]');
                const do_login = await page.$('#do-login');
                await do_login.click();
                console.log("done waitForSelector('a[id=do-login]"); 

                console.log("waitForSelector('button[id=cancel_init_password]')"); 
                page.waitForTimeout(5000).then(() => console.log('waitForSelector cancel_init_password!'));
                await page.waitForSelector('button[id=cancel_init_password]');
                await page.screenshot({ path: 'cancel_init_password.png' });
                console.log("done waitForSelector('button[id=cancel_init_password]')");
                
                console.log("waitForSelector('button[id=cancel_init_password]')"); 
                await page.waitForSelector('button[id=cancel_init_password]');
                const cancel_init_password = await page.$('#cancel_init_password');
                // await cancel_init_password.click();
                console.log("done waitForSelector('button[id=cancel_init_password]')")

                if(cancel_init_password != null){
                    console.log("await page.goto_napthe;")
                    await page.goto('https://www.mobifone.vn/tien-ich?hinh-thuc=nap-tien');
                    await page.screenshot({ path: 'connect_page_napthe.png' });
                    console.log("done page.goto_napthe;")
                }

                // call api cap the
                setTimeout(() => {
                    console.log("call api cap the")
                    axios.post('https://api-capthe.free.beeceptor.com/api/capthe', {"transID" : "test"})
                    .then(async (response) => {
                        console.log(response.data.code)
                        console.log("api cap the da tra the")
                        scratch_card = response.data.code
                        page.waitForTimeout(3000).then(() => console.log('Waited a second!'));

                        console.log("waitForSelector('input[id=card_id]"); 
                        await page.waitForSelector('input[id=card_id]');
                        // await page.$eval('#phone_input', (el, numberPhone) => el.value = numberPhone);
                        await page.$eval('#card_id', (el, scratch_card) => {
                            console.log(el, scratch_card);
                            return el.value = scratch_card;
                        }, scratch_card);
                        await page.screenshot({ path: 'fill_scratch_card.png' });
                        console.log("done waitForSelector('input[id=card_id]")

                        console.log("await page.$('#submit-refill');")
                        const check_otp = await page.$('#submit-refill');
                        await check_otp.click();
                        await page.screenshot({ path: 'submit_scratch_card.png' });
                        console.log("done await page.$('#submit-refill');")
                    })
                    .catch((error) => {
                        console.log(error)
                    })  
                    
                }, 2000)

                console.log("browser.close();");
                
            }, 30000)
        } catch (error) {
            console.log(error.message)  
        }
}

module.exports = {
    otpMobifone,
    mobifoneProcess
}

