const $containerTraining = document.querySelector("#training_autofill")
const $containerCoursesLearning = document.querySelector("#learning_courses")
const $containerCoursesCompleted = document.querySelector("#completed_courses")
autofill()
function autofill() {
    const heightTrainingLearning = window.getComputedStyle($containerCoursesLearning).getPropertyValue("height").replace("px", "")
    const heightTrainingCompleted = window.getComputedStyle($containerCoursesLearning).getPropertyValue("height").replace("px", "")
    if (window.innerHeight > 699) {
        if (parseInt(heightTrainingLearning, 10) <= 600 && parseInt(heightTrainingCompleted, 10) <= 600) {
            $containerTraining.style.height = "100vh"
        } else {
            $containerTraining.style.height = "auto"
        }
    } else {
        if (parseInt(heightTrainingLearning, 10) <= 200 && parseInt(heightTrainingCompleted, 10) <= 200) {
            $containerTraining.style.height = "100vh"
        } else {
            $containerTraining.style.height = "auto"
        }
    }



}