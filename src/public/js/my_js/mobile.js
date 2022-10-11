console.log("Client side javascript is loaded")
const mobileForm = document.querySelector('form')

const ele = document.getElementsByName('brandtype')

mobileForm.addEventListener('submit', (e) => {
    e.preventDefault()

    for(i = 0; i < ele.length; i++) {
        if(ele[i].checked){
           
            console.log(mobileForm.getAttribute("action"))
            window.location.reload(true);
            window.location.href = ele[i].value;
            ele[i].checked = false
        }
    }
    
})  


