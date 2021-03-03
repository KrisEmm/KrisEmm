const $header_menu_button = document.querySelector('#header_menu_button');
const $menu_modal = document.querySelector('#menu_modal');
const $menu_modal_close_button = document.querySelector("#menu_modal-close")
const $classToShowModal = "menu-show";

if ($header_menu_button) {
    $header_menu_button.addEventListener("click", cilckHandlerMenuButton)
}
if ($menu_modal_close_button) {
    $menu_modal_close_button.addEventListener("click", cilckHandlerMenuModalCloseButton)
}

function cilckHandlerMenuModalCloseButton(e) {
    if (!$menu_modal) return;
    $menu_modal.classList.toggle($classToShowModal);
}
function cilckHandlerMenuButton(e) {
    if (!$menu_modal) return;
    $menu_modal.classList.toggle($classToShowModal);
}