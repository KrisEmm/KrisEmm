console.log("Portfolio")
const $containerPortfolio = document.querySelector("#portfolio-seccion-projects")
const $portfolio = document.querySelector("#portfolio")
const $query_filter_input = document.querySelector("#projects_filter_query")
const $tab_all_filter = document.querySelector("#tab_all")
const $tab_projects_filter = document.querySelector("#tab_projects")
const $tab_exercises_filter = document.querySelector("#tab_exercises")
const $tabs = document.querySelectorAll(".projects_tabs_tab")
const $icon_pushpin = document.querySelectorAll(".push_random_color")
const $icon_focus = document.querySelectorAll(".focus_random_color")
const $projects_list_project = document.querySelectorAll(".projects_list_project")
const $allPortfolio = document.querySelectorAll("#portfolio>details")
const $projectsPortfolio = document.querySelectorAll(".portfolio-project")
const $exercisesPortfolio = document.querySelectorAll(".portfolio-exercise")
const $resultQueryNoMatch = document.querySelector(".projects_filter_result>p")
let matches = 0
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
document.addEventListener("DOMContentLoaded", setClassColorRandom)
document.addEventListener("DOMContentLoaded", setOpenAttribute)
window.addEventListener("resize", setOpenAttribute)

if ($query_filter_input) {
    $query_filter_input.addEventListener("search", filterByInputSearch)
    $query_filter_input.addEventListener("input", watchInputSearch)
}
if ($tab_all_filter) {
    $tab_all_filter.addEventListener("click", filterByTabSelected)
}
if ($tab_projects_filter) {
    $tab_projects_filter.addEventListener("click", filterByTabSelected)
}
if ($tab_exercises_filter) {
    $tab_exercises_filter.addEventListener("click", filterByTabSelected)
}
function filterByTabSelected(e) {
    setResultNoMatch("")
    changeStateTabSelected(e)
    let query = $query_filter_input.value.toLowerCase().trim();
    const filterSelected = getFilterByTabSelected()
    filterAllPortfolioByTabSelected(filterSelected)
    if (query === "") return
    matches = 0
    filterByQueryIntoTabSelected(filterSelected, query)
    if (matches > 0) return
    setResultNoMatch("no match found")
}
function filterByInputSearch() {
    matches = 0
    let query = $query_filter_input.value.toLowerCase().trim();
    if (query === "") return
    const filterSelected = getFilterByTabSelected()
    filterByQueryIntoTabSelected(filterSelected, query)
    if (matches > 0) return
    setResultNoMatch("no match found")
}
function setResultNoMatch(message) {
    $resultQueryNoMatch.innerText = message
}
autofill()
function autofill() {
    console.clear();
    const heightPortfolio = window.getComputedStyle($portfolio).getPropertyValue("height").replace("px", "")
    const heightContainerPortfolio = window.getComputedStyle($containerPortfolio).getPropertyValue("height").replace("px", "")
    console.log(`portfolio: ${parseInt(heightPortfolio, 10)}`)
    console.log(`container: ${parseInt(heightContainerPortfolio, 10)}`)
    console.log(`windowHeight: ${window.innerHeight}`)
    if (window.innerHeight > 699) {
        if (parseInt(heightPortfolio, 10) <= 600) {
            $containerPortfolio.style.height = "100vh"
        } else {
            $containerPortfolio.style.height = "auto"
        }
    } else {
        if (parseInt(heightPortfolio, 10) <= 200) {
            $containerPortfolio.style.height = "100vh"
        } else {
            $containerPortfolio.style.height = "auto"
        }
    }

}
function watchInputSearch(e) {
    if (e.target.value === "") {
        setResultNoMatch("")
        const filterSelected = getFilterByTabSelected()
        switch (filterSelected) {
            case "all":
                clearElementsFiltered($allPortfolio)

                break;
            case "project":
                clearElementsFiltered($projectsPortfolio)


                break;
            case "exercise":
                clearElementsFiltered($exercisesPortfolio)


                break;
            default:
                break;
        }
    }
}
function changeStateTabSelected(e) {
    if ($tabs.length <= 0) return
    const tabSelected = e.target
    for (let tab_selected of $tabs) {
        if (tab_selected.classList.contains("projects_tabs_tab-selected")) {
            tab_selected.classList.remove("projects_tabs_tab-selected")
        }
    }
    tabSelected.classList.add("projects_tabs_tab-selected")
}
function getFilterByTabSelected() {
    let filter = null
    for (let tab_selected of $tabs) {
        if (tab_selected.classList.contains("projects_tabs_tab-selected")) {
            filter = tab_selected.getAttribute("data-filter-value").toLowerCase().trim()
        }
    }
    return filter
}
function filterAllPortfolioByTabSelected(filter) {

    if ($allPortfolio.length <= 0) return
    clearElementsFiltered($allPortfolio)
    if (filter === "all") {
        autofill()

        return
    }
    for (let item of $allPortfolio) {
        if (!item.classList.contains(`portfolio-${filter}`)) {
            item.classList.add("filtered")
        }
    }
    autofill()
}
function filterByQueryIntoTabSelected(filter, query) {

    switch (filter) {
        case "all":
            filterByQueryInto(query, $allPortfolio)

            break;
        case "project":
            filterByQueryInto(query, $projectsPortfolio)


            break;
        case "exercise":
            filterByQueryInto(query, $exercisesPortfolio)


            break;
        default:
            break;
    }
}
function clearElementsFiltered(list) {
    if (list.length <= 0) return
    for (let item of list) {
        if (item.classList.contains("filtered")) {
            item.classList.remove("filtered")
        }
    }
    autofill()

}
function filterByQueryInto(query, list) {
    if (list.length <= 0) return
    searchAndFilter(query, list)
    autofill()
}
function searchAndFilter(query, list) {
    for (let item of list) {
        const nameToCompare = item.getAttribute("data-name").toLowerCase()
        if (nameToCompare === null) break
        if (!nameToCompare.includes(query)) {
            item.classList.add("filtered")
        } else {
            matches = matches + 1
        }
    }
}
function setOpenAttribute() {
    if (window.innerWidth <= 899) {
        for (let project of $projects_list_project) {
            if (project.hasAttribute("open")) {
                project.removeAttribute("open")
            }
        }
    } else {
        for (let project of $projects_list_project) {
            if (!project.hasAttribute("open")) {
                project.setAttribute("open", "open")
            }
        }
    }

}
function setClassColorRandom() {
    pushpin()
    focus()
}
function getColor(colors) {
    const color = Math.floor(Math.random() * colors.length)
    return colors[color];
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