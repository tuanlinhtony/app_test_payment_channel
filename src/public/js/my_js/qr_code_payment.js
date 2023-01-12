console.log("Client side javascript is loaded")

const inputAmount = document.querySelector('.amount')
const inputTransactionID = document.querySelector('.transactionID')
const inputMerchantCode = document.querySelector('.merchantCode')
const inputApiToken = document.querySelector('.apiToken')
const chargeMobileSubmit = document.getElementById('chargeMobileSubmit')
const loadingShowBox = document.querySelector('.showbox')
const chargeMoneyMobile = document.querySelector('.chargeMoneyMobile')


chargeMobileSubmit.addEventListener('submit', (e) => {
    e.preventDefault()
        const dataRequest = {
            merchantCode: "869c61b9-480e-4c2b-be46-55522842b951",
            merchantKey: "2KtvWirwvu3anc2",
            transactionId: inputTransactionID.value,
            moneyRequest: inputAmount.value,
            customerIp: "123.234.445",
            type: "payin"
        }
        console.log(inputAmount.value)
        console.log(inputTransactionID.value)
        var sign = ''

        chargeMoneyMobile.style.display = "none"
        loadingShowBox.style.display = "block"

        const RedirectURL = () => {
            // window.location.href = "https://spayteam.com/payment/" + sign;
            // window.open("https://spayteam.com/payment/" + sign);
        }

        setTimeout(RedirectURL, 5000)
        fetch("https://api.spayteam.pro/v1/pay", {
            method: 'POST',
            body: JSON.stringify(dataRequest),
            headers: { 'Content-Type': 'application/json' }
        }).then((response) => {
            console.log(response)
            response.json().then((data) =>{
                if(data.error){
                    messageOne.textContent = data.error

                }else{
                    console.log(data)
                    sign = data.sign.toString()
                    window.open("https://spayteam.com/payment/" + sign);
                }
            })
        })
        console.log(sign)

        inputTransactionID.value = ''
        inputAmount.value = ''
        // window.location.href = "https://spay.thaotulanh.info/payment/" + data.sign;

})

// otp_submit.addEventListener('submit', (e) => {
//     e.preventDefault()
//     console.log(otpInputField.value)
//     const dataRequest = {
//         otp: otpInputField.value
//     }
//     fetch("/authCharge", {
//         method: 'POST',
//         body: JSON.stringify(dataRequest),
//         headers: { 'Content-Type': 'application/json' }
//     }).then((response) => {
//         console.log(response)
//         response.json().then((data) =>{
//             if(data.error){
//                 messageOne.textContent = data.error
//
//             }else{
//                 console.log(data)
//             }
//         })
//     })
//     otpContainerID.remove()
//     loadingShowBox.style.display = 'grid'
// })
//
