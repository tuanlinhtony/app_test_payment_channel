console.log("Client side javascript is loaded")

const inputAmount = document.querySelector('.amount')
const inputTransactionID = document.querySelector('.transactionID')
const inputAccountNumber = document.querySelector('.accountNumber')
const inputAccountName = document.querySelector('.accountName')
const selectBank = document.getElementById('selectBank')
const loadingShowBox = document.querySelector('.showbox')
const chargePayoutSubmit = document.getElementById('chargePayoutSubmit')



chargePayoutSubmit.addEventListener('submit', (e) => {
    e.preventDefault()
        const dataRequest = {
            merchantCode: "0b586d24-8176-49ff-bac0-0ceb33616a22",
            merchantKey: "odOYoUaKFqtmfOg",
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

        // const RedirectURL = () => {
        //     window.location.href = "https://spay.thaotulanh.info/payment/" + sign;
        // }

        // setTimeout(RedirectURL, 5000)
        fetch("https://spay-api.thaotulanh.info/v1/payout", {
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

