console.log("Client side javascript is loaded")

const inputAmount = document.querySelector('.amount')
const inputTransactionID = document.querySelector('.transactionID')
const inputAccountNumber = document.querySelector('.accountNumber')
const inputMerchantCode = document.querySelector('.merchantCode')
const inputAccountName = document.querySelector('.accountName')
const selectBank = document.getElementById('selectBank')
const chargePayoutSubmit = document.getElementById('chargePayoutSubmit')
const loadingShowBox = document.querySelector('.showbox')
const chargeMoneyMobile = document.querySelector('.chargeMoneyMobile')


chargePayoutSubmit.addEventListener('submit', (e) => {
    e.preventDefault()
        const dataRequest = {
            merchantCode: inputMerchantCode.value,
            merchantKey: inputApiToken.value,
            transactionId: inputTransactionID.value,
            moneyRequest: inputAmount.value,
            bankCode: selectBank.value,
            bankAccountNumber: inputAccountNumber.value,
            bankAccountName: inputAccountName.value,
            customerIp: "123.234.445"
        }
        console.log(inputAmount.value)
        console.log(inputTransactionID.value)
        console.log(inputAccountNumber.value)
        console.log(inputAccountName.value)
        console.log(selectBank.value)
        var sign = ''

        chargeMoneyMobile.style.display = "none"
        loadingShowBox.style.display = "block"
        // const RedirectURL = () => {
        //     window.location.href = "https://spay.thaotulanh.info/payment/" + sign;
        // }

        // setTimeout(RedirectURL, 5000)
        fetch("https://api.spayteam.pro/v1/payout", {
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

        // inputTransactionID.value = ''
        // inputAmount.value = ''
        // window.location.href = "https://spay.thaotulanh.info/payment/" + data.sign;

})

