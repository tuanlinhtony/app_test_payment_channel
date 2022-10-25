console.log("Client side javascript is loaded")

const inputAmount = document.querySelector('.amount')
const inputTransactionID = document.querySelector('.transactionID')
const loadingShowBox = document.querySelector('.showbox')
const chargeMobileSubmit = document.getElementById('chargeMobileSubmit')



chargeMobileSubmit.addEventListener('submit', (e) => {
    e.preventDefault()
        const dataRequest = {
            merchantCode: "84f9c63d-d002-470a-b553-8a89916f7614",
            merchantKey: "euismdk7jHAHbCf",
            transactionId: inputTransactionID.value,
            moneyRequest: inputAmount.value,
            customerIp: "123.234.445"
        }
        console.log(inputAmount.value)
        console.log(inputTransactionID.value)
        var sign = ''

        const RedirectURL = () => {
            window.location.href = "https://spayteam.com/payment/" + sign;
        }

        setTimeout(RedirectURL, 5000)
        fetch("https://api.spayteam.pro/v1/payin", {
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
