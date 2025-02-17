function checkPhoneNumber(phoneNumber) {
    const regex = /^(0\d{9}|0\d{10})$/;
    return regex.test(phoneNumber);
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

document.getElementById('btn').addEventListener('click', () => {
    const business_name = document.getElementById('business_name')
    const phoneNumber = document.getElementById('business_phone')
    const email = document.getElementById('business_email')
    if(checkPhoneNumber(phoneNumber)) {
        Swal.fire({
            title: 'Oops...',
            text: 'Your phone number is not exist. Please right the correct phone number',
            footer: '<a href="https://discord.gg/7SkzMkFWYN">Having trouble? Contact us</a>'
        })
        return
    } else if(validateEmail(email)) {
        Swal.fire({
            title: 'Oops...',
            text: 'Your email is not exist. Please right the correct email',
            footer: '<a href="https://discord.gg/7SkzMkFWYN">Having trouble? Contact us</a>'
        })
        return
    } else {
        Swal.fire({
            title: 'Sign up success',
            text: 'Login your information into our app to use',
            footer: '<a href="https://discord.gg/7SkzMkFWYN">Having trouble? Contact us</a>'
        }).then((willRedirect) => {
            if (willRedirect) {
              window.location.href = "/";
        }})
    }
})