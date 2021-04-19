const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const inquirer = require('inquirer');
const { forms } = require("../forms")
const adapter = new FileSync("./src/data/db.json");
const db = low(adapter);
module.exports.interfaceDeleteCommand = async function (name, isProjectSelected, isExerciseSelected, isCourseSelected) {
    try {
        let type = null
        if (!isProjectSelected && !isExerciseSelected && !isCourseSelected) {
            type = await getTypeFromUser()
            type = type.name
        }
        if (isCourseSelected || type === "course") {
            deleteCourse(name)
            return
        } else {
            type = isExerciseSelected ? "exercise" : "project"
            if (!name) {
                deleteWithoutNameRepo(type)
            } else {
                deleteWithNameRepo(name, type)
            }
            return
        }
    } catch (error) {
        console.log(error)
    }
}

async function deleteWithNameRepo(name, type) {
    const list = type === "project" ? "projects" : "exercises"
    forms.delete.repo.default = name
    let repoNameSeleted = await inquirer.prompt([
        forms.delete.repo,
    ])
    name = repoNameSeleted.repo_name
    if (name === "") {
        deleteWithoutNameRepo(type)
        return
    }
    const result = db.get("repositories").filter({ type: type, name: name }).value()
    if (result.length <= 0) {
        console.log(`there is no match with ${name} name into ${list} list`)
        deleteWithoutNameRepo(type)
        return
    }
    console.log(result[0])
    const res = await inquirer.prompt([
        forms.delete.confirm,
    ])
    if (!res.delete) return
    console.log("deleting...")
    db.get("repositories").remove({ name: result[0].name }).write()
    db.get("lastest_repos").remove({ name: result[0].name }).write()
    if (type === "project") {
        db.set("lastest_project", {}).write()
        let projects_length = db.get("user.projects_length").value();
        projects_length = projects_length - 1;
        db.set("user.projects_length", projects_length).write();
    }
    let repos_length = db.get("user.repos_length").value();
    repos_length = repos_length - 1;
    db.set("user.repos_length", repos_length).write();
    console.clear()
    console.log("deleted successfully")
    console.log(result[0])
    console.log("\n")
    console.log("Do not forget to see these changes on your website enter the following commands")
    console.log("\n")
    console.log("git add src/data/db.json")
    console.log("git commit")
    console.log("git push origin master")
}
async function deleteWithoutNameRepo(type) {
    const list = type === "project" ? "projects" : "exercises"
    const result = db.get("repositories").filter({ type: type }).map("name").value()
    if (result.length <= 0) {
        console.log(`the ${list} list is empty`)
        return
    }
    forms.delete.list.choices = result
    const repoNameSeleted = await inquirer.prompt([
        forms.delete.list,
    ])
    const repo = db.get("repositories").filter({ type: type, name: repoNameSeleted.repo_selected }).value()
    console.log(repo)
    const res = await inquirer.prompt([
        forms.delete.confirm,
    ])
    if (!res.delete) return
    console.log("deleting...")
    db.get("repositories").remove({ name: repoNameSeleted.repo_selected }).write()
    db.get("lastest_repos").remove({ name: repoNameSeleted.repo_selected }).write()
    if (type === "project") {
        db.set("lastest_project", {}).write()
        let projects_length = db.get("user.projects_length").value();
        projects_length = projects_length - 1;
        db.set("user.projects_length", projects_length).write();
    }
    let repos_length = db.get("user.repos_length").value();
    repos_length = repos_length - 1;
    db.set("user.repos_length", repos_length).write();
    console.clear()
    console.log("deleted successfully")
    console.log(repo)
    console.log("\n")
    console.log("Do not forget to see these changes on your website enter the following commands")
    console.log("\n")
    console.log("git add src/data/db.json")
    console.log("git commit")
    console.log("git push origin master")
}
async function deleteCourse(name) {
    if (name) forms.delete.query.default = name
    let query = await inquirer.prompt([
        forms.delete.query,
    ])
    name = query.value
    const courseSelected = db.get("courses").filter({ name: name }).value()
    if (courseSelected.length <= 0) {
        console.log(`there is no match with ${name} name into courses list`)
        return
    }
    console.log(courseSelected[0])
    let res = await inquirer.prompt([
        forms.delete.confirm,
    ])
    if (!res.delete) return
    const course = db.get("courses").filter({ id: courseSelected[0].id }).value()
    let courses_length = db.get("user.courses_length").value()

    db.get("courses").remove({ id: courseSelected[0].id }).write()
    courses_length = courses_length - 1
    db.set("user.courses_length", courses_length).write();
    console.log(course[0].status)
    if (course[0].status === "learning") {
        const course = db.get("lastest_courses_learning").filter({ id: courseSelected[0].id }).value()
        if (course.length > 0) db.get("lastest_courses_learning").remove({ id: courseSelected[0].id }).write()

    }
    if (course[0].status === "completed") {
        const course = db.get("lastest_courses_completed").filter({ id: courseSelected[0].id }).value()
        if (course.length > 0) db.get("lastest_courses_completed").remove({ id: courseSelected[0].id }).write()

    }
    console.clear()
    console.log("deleted successfully")
    console.log(course)
    console.log("\n")
    console.log("Do not forget to see these changes on your website enter the following commands")
    console.log("\n")
    console.log("git add src/data/db.json")
    console.log("git commit")
    console.log("git push origin master")
}