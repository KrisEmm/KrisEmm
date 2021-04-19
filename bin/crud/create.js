const fs = require('fs')
const path = require('path')
const axios = require('axios');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const inquirer = require('inquirer');
const { Project, Exercise, Course } = require("../models");
const { nanoid } = require("nanoid")
const { forms } = require("../forms")
const adapter = new FileSync("./src/data/db.json");
const db = low(adapter);
const maxLengthToLastestRepos = 3;

module.exports.interfaceAddCommand = async function (
    name,
    isProjectSelected,
    isExerciseSelected,
    isCourseSelected
) {
    let type = null

    if (!isProjectSelected && !isExerciseSelected && !isCourseSelected) {
        type = await getTypeFromUser()
        type = type.name
        console.log(type)
    }
    try {
        if (isCourseSelected || type === "course") {
            setCourse(name)
            return
        }
        let generalInfo = await getUserAndRepoNames(name)
        console.log("Searching on Github...")
        const repoInfo = await getRepoFromGithub(generalInfo.user_name, generalInfo.repo_name)
        if (repoInfo.repo === null) {
            console.log(repoInfo.message)
            return
        }
        console.log("Repository found")
        console.log(repoInfo.repo)
        res = await inquirer.prompt([
            forms.add.confirm,
        ])
        if (!res.isRepoWantToSave) {
            console.log("Sorry, Try it again")
            return
        }
        type = isExerciseSelected ? "exercise" : "project"
        setInfoExtra(repoInfo.repo, type)
    } catch (error) {
        console.log(error)
    }
}

async function getTypeFromUser() {
    let res = await inquirer.prompt([
        forms.type,
    ])
    return res
}

async function setCourse(name) {
    if (name) forms.add.course.name.default = name
    res = await inquirer.prompt([
        forms.add.course.name,
        forms.add.course.company,
        forms.add.course.duration,
        forms.add.course.url,
        forms.add.course.image,
        forms.add.course.status,

    ])
    const newCourse = new Course()
    newCourse.name = res.course_name
    newCourse.company = res.company_name
    newCourse.duration = res.duration
    newCourse.url = res.url_course
    newCourse.image = `assets/images/${res.image}`
    newCourse.status = res.status
    newCourse.id = nanoid()
    if (res.status === "completed") {
        res = await inquirer.prompt([
            forms.add.course.certificate,
        ])
        newCourse.certificate = `assets/images/${res.certificate}`
    }
    let courses_length = db.get("user.courses_length").value();
    courses_length = courses_length + 1;
    db.set("user.courses_length", courses_length).write();
    db.get('courses').unshift(newCourse).write();
    if (newCourse.status === "learning") {
        let lastest_courses_learning = db.get("lastest_courses_learning").value()
        if (lastest_courses_learning.length === 3) {
            lastest_courses_learning.unshift(newCourse)
            lastest_courses_learning.pop()
        } else {
            lastest_courses_learning.unshift(newCourse)
        }
        db.get("lastest_courses_learning").assign(lastest_courses_learning).write();
    } else if (newCourse.status === "completed") {
        let lastest_courses_completed = db.get("lastest_courses_completed").value()
        if (lastest_courses_completed.length === 3) {
            lastest_courses_completed.unshift(newCourse)
            lastest_courses_completed.pop()
        } else {
            lastest_courses_completed.unshift(newCourse)
        }
        db.get("lastest_courses_completed").assign(lastest_courses_completed).write();
    }
    console.clear();
    console.log("A new exercise has been added successfully")
    console.log(newCourse);
    console.log("\n")
    console.log("Do not forget to see these changes on your website enter the following commands")
    console.log("\n")
    console.log("git add src/data/db.json")
    console.log("git commit")
    console.log("git push origin master")
}

async function getUserAndRepoNames(name) {
    if (name) forms.add.repo.default = name
    let res = await inquirer.prompt([
        forms.add.user,
        forms.add.repo,
    ])
    return res
}

async function getRepoFromGithub(user_name, repo_name) {
    try {
        const repo = {
            id: "",
            name: "",
            description: "",
            source: "",
            languages: {},
            githubpage: ""
        }
        const github_url = `https://api.github.com/repos/${user_name}/${repo_name}`;
        const res = await axios.get(github_url);
        repo.id = res.data.id;
        repo.name = res.data.name;
        repo.description = res.data.description;
        repo.source = res.data.html_url;
        repo.githubpage = res.data.homepage;
        const reslanguages = await axios.get(res.data.languages_url);
        repo.languages = Object.keys(reslanguages.data);
        return {
            repo,
            message: null
        }
    } catch (error) {
        if (error.response.status === 404) return {
            repo: null,
            message: `User or Repository ${error.response.statusText}, try it with other User or Repository.`
        }
    }
}

async function setInfoExtra(repo, type) {
    switch (type.name) {
        case "project":
            setProject(repo, type)
            break;

        case "exercise":
            setExercise(repo, type)
            break;

        default:
            break;
    }
}

async function setProject(repo, type) {
    try {
        let res = null;
        let technologies = [];
        let repos_related = [];
        const newProject = new Project();
        newProject.id = repo.id;
        newProject.type = type.name;
        newProject.name = repo.name;
        newProject.description = repo.description;
        newProject.code_url = repo.source;
        newProject.languages = repo.languages;
        res = await inquirer.prompt([
            forms.add.exercise.status,
            forms.add.exercise.image,
        ])
        newProject.status = res.status;
        if (res.image != "") {
            newProject.image_url = `assets/images/${res.image}`;
        }
        do {
            res = await inquirer.prompt([
                forms.add.exercise.technologies,
            ])
            if (res.technologies === "") {
                res.add = false
                break
            }
            technologies.push(res.technologies)
            res = await inquirer.prompt([
                forms.add.exercise.addMoreConfirm,
            ])
        }
        while (res.add)
        do {
            const repo_related = {
                name: "",
                url: ""
            }
            res = await inquirer.prompt([
                forms.add.exercise.repo_related_name,
            ])
            if (res.repo_related_name === "") {
                res.add = false
                break
            }
            repo_related.name = res.repo_related_name;
            res = await inquirer.prompt([
                forms.add.exercise.repo_related_url,
            ])
            repo_related.url = res.repo_related_url;
            repos_related.push(repo_related);
            res = await inquirer.prompt([
                forms.add.exercise.addMoreConfirm,
            ])
        }
        while (res.add)
        newProject.technologies = technologies;
        newProject.repos_related = repos_related;
        const timestamp = new Date()
        newProject.registeredAt = timestamp.toISOString()

        console.log("wait a moment while saving this project")
        db.get('repositories').unshift(newProject).write();
        let projects_length = db.get("user.projects_length").value();
        projects_length = projects_length + 1;
        db.set("user.projects_length", projects_length).write();

        let repos_length = db.get("user.repos_length").value();
        repos_length = repos_length + 1;
        db.set("user.repos_length", repos_length).write();
        if (newProject.status === "completed") {
            db.get("lastest_project").assign(newProject).write();
        }
        let lastest_repos = db.get("lastest_repos").value()
        if (lastest_repos.length === maxLengthToLastestRepos) {
            lastest_repos.unshift(newProject)
            lastest_repos.pop()
        } else {
            lastest_repos.unshift(newProject)
        }
        db.get("lastest_repos").assign(lastest_repos).write();
        console.clear();
        console.log("A new project has been added successfully");
        console.log(newProject);
        console.log("\n");
        console.log("Do not forget to see these changes on your website enter the following commands");
        console.log("\n");
        console.log("git add src/data/db.json");
        console.log("git commit");
        console.log("git push origin master");

    } catch (error) {
        console.log(error)
    }
}
async function setExercise(repo, type) {
    try {
        let res = null;
        let technologies = [];
        let repos_related = [];
        const newExercise = new Exercise();
        newExercise.id = repo.id;
        newExercise.type = type.name;
        newExercise.name = repo.name;
        newExercise.description = repo.description;
        newExercise.code_url = repo.source;
        newExercise.languages = repo.languages;
        res = await inquirer.prompt([
            forms.add.exercise.status,
            forms.add.exercise.image,
        ])
        newExercise.status = res.status;
        if (res.image != "") {
            newExercise.image_url = `assets/images/${res.image}`;
        }
        do {
            res = await inquirer.prompt([
                forms.add.exercise.technologies,
            ])
            if (res.technologies === "") {
                res.add = false
                break
            }
            technologies.push(res.technologies)
            res = await inquirer.prompt([
                forms.add.exercise.addMoreConfirm,
            ])
        }
        while (res.add)
        do {
            const repo_related = {
                name: "",
                url: ""
            }
            res = await inquirer.prompt([
                forms.add.exercise.repo_related_name,
            ])
            if (res.repo_related_name === "") {
                res.add = false
                break
            }
            repo_related.name = res.repo_related_name;
            res = await inquirer.prompt([
                forms.add.exercise.repo_related_url,
            ])
            repo_related.url = res.repo_related_url;
            repos_related.push(repo_related);
            res = await inquirer.prompt([
                forms.add.exercise.addMoreConfirm,
            ])
        }
        while (res.add)
        newExercise.technologies = technologies;
        newExercise.repos_related = repos_related;
        res = await inquirer.prompt([
            forms.add.exercise.reference_source,
        ])
        newExercise.reference.source = res.reference_source;
        if (res.reference_source != "personal") {
            res = await inquirer.prompt([
                forms.add.exercise.reference_url
            ])
            newExercise.reference.url = res.reference_url;
        }
        const timestamp = new Date();
        newExercise.registeredAt = timestamp.toISOString();
        console.log("wait a moment while saving this project")
        db.get('repositories').unshift(newExercise).write();
        let repos_length = db.get("user.repos_length").value();
        repos_length = repos_length + 1;
        db.set("user.repos_length", repos_length).write();
        let lastest_repos = db.get("lastest_repos").value()
        if (lastest_repos.length === maxLengthToLastestRepos) {
            lastest_repos.unshift(newExercise)
            lastest_repos.pop()
        } else {
            lastest_repos.unshift(newExercise)
        }
        db.get("lastest_repos").assign(lastest_repos).write()
        console.clear();
        console.log("A new exercise has been added successfully")
        console.log(newExercise);
        console.log("\n")
        console.log("Do not forget to see these changes on your website enter the following commands")
        console.log("\n")
        console.log("git add src/data/db.json")
        console.log("git commit")
        console.log("git push origin master")
    } catch (error) {
        console.log(error)
    }
}
