const $role = document.querySelector("#role")
const $tool = document.querySelector("#tool")
const $object1 = document.querySelector(".object-1")
const $object1_use = document.querySelector("#obj_1")
const $object2 = document.querySelector(".object-2")
const $object2_use = document.querySelector("#obj_2")
const $icon_pushpin = document.querySelectorAll(".push_random_color")
const $icon_focus = document.querySelectorAll(".focus_random_color")
const $modal = document.querySelector('#modal');
const $modal_close_button = document.querySelector("#modal-close");
const $courses_completed = document.querySelector("#courses-completed");
const $classToShowModal = "modal-show";
const $certificated_course_seleted_class = "training_completed_courses_course_img";
const $image_modal = document.querySelector("#image_certificated");
const frontend_list = [
    "html",
    "css",
    "sass",
    "javascrip",
    "typescript",
    "react",
    "redux",
    "npm",
    "git",
    "bash",
    "linux",
]
const backend_list = [
    "nodeJS",
    "php",
    "laravel",
    "symfony",
    "java",
    "spring",
    "mysql",
    "npm",
    "composer",
    "git",
    "bash",
    "linux",
    "docker",
    "nginx",
]
const frontend = {
    html: "#html",
    css: "#css",
    sass: "#sass",
    javascrip: "#js",
    typescript: "#ts",
    react: "#react",
    redux: "#redux",
    npm: "#npm",
    git: "#git",
    bash: "#bash",
    linux: "#linux",
}
const backend = {
    nodeJS: "#nodejs",
    javascrip: "#js",
    typescript: "#ts",
    php: "#php",
    laravel: "#laravel",
    symfony: "#symfony",
    java: "#java",
    spring: "#spring",
    mysql: "#mysql",
    npm: "#npm",
    composer: "#composer",
    git: "#git",
    bash: "#bash",
    linux: "#linux",
    docker: "#docker",
    nginx: "#nginx",
}
const colors = [
    "red",
    "pink",
    "purple",
    "violet",
    "dark-blue",
    "blue",
    "yellow",
    "orange",
    "green",
    "cyan",
]
let flatActive = false;
if ($modal_close_button) {
    $modal_close_button.addEventListener("click", cilckHandlerModalCloseButton)
}
if ($courses_completed) {
    $courses_completed.addEventListener("click", clickHandleCourseCertificatedSelected)
}
document.addEventListener("DOMContentLoaded", setClassColorRandom)
document.addEventListener("scroll", () => {
    if (window.scrollY >= 1200 && window.scrollY <= 3000) {
        if (flatActive) return
        $object1.classList.toggle("object-1-active")
        flatActive = true
    } else {
        if ($object1.classList.contains("object-1-active")) $object1.classList.remove("object-1-active")
        if ($object2.classList.contains("object-2-active")) $object2.classList.remove("object-2-active")
        flatActive = false
    }
})
$object1.addEventListener('animationstart', (e) => {
    $object2.classList.toggle("object-2-active")
})
$object1.addEventListener('animationend', (e) => {
    setRandomElementToObj2()
    $object2.classList.toggle("object-2-active")
})
$object2.addEventListener('animationstart', (e) => {
    $object1.classList.toggle("object-1-active")
})
$object2.addEventListener('animationend', (e) => {
    setRandomElementToObj1()
    $object1.classList.toggle("object-1-active")
})

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
function getColor(colors) {
    const color = Math.floor(Math.random() * colors.length)
    return colors[color];
}
function getFrontendRandom(list, keys) {
    const value = Math.floor(Math.random() * list.length)
    return {
        dev: "Frontend",
        key: list[value],
        value: keys[list[value]]
    };
}
function getBackendRandom(list, keys) {
    const value = Math.floor(Math.random() * list.length)
    return {
        dev: "Backend",
        key: list[value],
        value: keys[list[value]]
    };
}
function setRandomElementToObj1() {
    elementRandomToObj1 = getFrontendRandom(frontend_list, frontend)
    $role.innerText = elementRandomToObj1.dev
    $tool.innerText = elementRandomToObj1.key
    $object1_use.setAttribute("href", elementRandomToObj1.value)
}
function setRandomElementToObj2() {
    elementRandomToObj2 = getBackendRandom(backend_list, backend)
    $role.innerText = elementRandomToObj2.dev
    $tool.innerText = elementRandomToObj2.key
    $object2_use.setAttribute("href", elementRandomToObj2.value)
}
function setClassColorRandom() {
    pushpin()
    focus()
}
function pushpin() {
    if (!$icon_pushpin.length > 0) return;
    let counter = 1;
    let color = getColor(colors);
    for (let icon of $icon_pushpin) {
        icon.classList.add(`push_random_color-${color}`)
        if (counter === 2) {
            counter = 0;
            color = getColor(colors)
        }
        counter = counter + 1
    }
}
function focus() {
    if (!$icon_focus.length > 0) return;
    for (let icon of $icon_focus) {
        const color = getColor(colors);
        icon.classList.add(`focus_random_color-${color}`)
    }
}
