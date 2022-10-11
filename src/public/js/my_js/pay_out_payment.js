console.log("Client side javascript is loaded")

const inputAmount = document.querySelector('.amount')
const inputTransactionID = document.querySelector('.transactionID')
const inputAccountNumber = document.querySelector('.accountNumber')
const inputAccountName = document.querySelector('.accountName')
const selectBank = document.querySelector('.selectBank')
const loadingShowBox = document.querySelector('.showbox')
const chargePayoutSubmit = document.getElementById('chargePayoutSubmit')



chargePayoutSubmit.addEventListener('submit', (e) => {
    e.preventDefault()
        const dataRequest = {
            merchantCode: "a7e5302f-ed13-4b39-80fa-e511c47e2cc1",
            merchantKey: "H47cAcEzr8nz1vr",
            transactionId: "13465457984653132465",
            moneyRequest: inputAmount.value,
            bankCode: selectBank.value,
            bankAccountNumber: inputAccountNumber.value,
            bankAccountName: inputAccountName.value,
            customerIp: "123.234.445"
        }
        console.log(inputAmount.value)
        console.log(inputAccountNumber.value)
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

