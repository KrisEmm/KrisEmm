const $header_menu_button = document.querySelector('#header_menu_button');
const $menu_modal = document.querySelector('#menu_modal');
const $menu_modal_close_button = document.querySelector("#menu_modal-close");
const $classToShowModalMenu = "menu-show";
const $modal = document.querySelector('#modal');
const $modal_close_button = document.querySelector("#modal-close");
const $courses_completed = document.querySelector("#courses-completed");
const $classToShowModal = "modal-show";
const $certificated_course_seleted_class = "certificated";
const $image_modal = document.querySelector("#image_certificated");


if ($header_menu_button) {
    $header_menu_button.addEventListener("click", cilckHandlerMenuButton)
}
if ($menu_modal_close_button) {
    $menu_modal_close_button.addEventListener("click", cilckHandlerMenuModalCloseButton)
}
if ($modal_close_button) {
    $modal_close_button.addEventListener("click", cilckHandlerModalCloseButton)
}
if ($courses_completed) {
    $courses_completed.addEventListener("click", clickHandleCourseCertificatedSelected)
}
function cilckHandlerMenuModalCloseButton(e) {
    if (!$menu_modal) return;
    $menu_modal.classList.toggle($classToShowModalMenu);
}
function cilckHandlerMenuButton(e) {
    if (!$menu_modal) return;
    $menu_modal.classList.toggle($classToShowModalMenu);
}
function cilckHandlerModalCloseButton(e) {
    if (!$modal) return;
    $modal.classList.toggle($classToShowModal);
    document.body.style.overflow = "visible"
}
function clickHandleCourseCertificatedSelected(e) {
    const certificated_seleted = e.target;
    if (!certificated_seleted.classList.contains($certificated_course_seleted_class)) {
        return
    }
    const src_image_certificated_selected = certificated_seleted.getAttribute("src")
    if (!$modal) return;
    $modal.classList.toggle($classToShowModal);
    $image_modal.setAttribute("src", src_image_certificated_selected)
    document.body.style.overflow = "hidden"
}