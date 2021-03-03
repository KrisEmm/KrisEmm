const $form_contact = document.querySelector("#contact_form")
const $notify_contact_success = document.querySelector("#notify_contact_success")
const $notify_contact_error = document.querySelector("#notify_contact_error")
const $btn_close_notify_contact = document.querySelector("#btn_close_notify_contact")
const $btn_trylater_notify_contact = document.querySelector("#btn_trylater_notify_contact")
const $btn_send_message = document.querySelector("#btn_send_message")
const info = {
    user_id: "user_AhNWKrGDTxN7FLeKNYyoH",
    service_id: "contact_service",
    template_id: "contact_form",
}

if ($form_contact) {
    $form_contact.addEventListener("submit", sendFormContact)
}
if ($btn_close_notify_contact) {
    $btn_close_notify_contact.addEventListener("click", closeNotifyContactSucess)
}
if ($btn_trylater_notify_contact) {
    $btn_trylater_notify_contact.addEventListener("click", closeNotifyContactError)
}
emailjs.init(info.user_id);
function statusMessage(status) {
    if (!$btn_send_message) return
    $btn_send_message.innerText = status
}
function sendFormContact(e) {
    e.preventDefault();
    statusMessage("Wait Sending Message...")
    emailjs.sendForm(info.service_id, info.template_id, e.target).then(function () {
        showNotifyContactSuccess();
        e.target.reset();
        statusMessage("Send Message")
    }, function (error) {
        showNotifyContactError();
        e.target.reset();
        statusMessage("Send Message")
    });

}
function showNotifyContactSuccess() {
    if (!$notify_contact_success) return
    $notify_contact_success.classList.add("notify_contact-show")
}
function showNotifyContactError() {
    if (!$notify_contact_error) return
    $notify_contact_error.classList.add("notify_contact-show")
}
function closeNotifyContactSucess(e) {
    if (!$notify_contact_success) return
    $notify_contact_success.classList.remove("notify_contact-show")
}
function closeNotifyContactError(e) {
    if (!$notify_contact_error) return
    $notify_contact_error.classList.remove("notify_contact-show")
}