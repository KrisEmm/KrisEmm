#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const axios = require('axios');
const cfonts = require('cfonts');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const { program } = require('commander');
const inquirer = require('inquirer');
const { Project, Exercise } = require("./models.js");
const { isArray } = require('util');

const adapter = new FileSync("./src/data/db.json");
const db = low(adapter);
const maxLengthToLastestRepos = 3;
const questions = {
    type: {
        type: "list",
        name: "name",
        message: "Select the type repository",
        choices: ["project", "exercise"],
    },
    list: {
        type: "list",
        name: "option",
        message: "Select a option to list",
        choices: ["user", "projects", "exercises", "lastest_project", "lastest_repos", "all"],
    },
    update: {
        list: {
            type: "list",
            name: "option",
            message: "Select a option to update",
            choices: ["user", "project", "exercise"],
        },
        repo: {
            type: "input",
            name: "name",
            message: "Do you want to search by this name ?",
            validate: (input) => input != "" ? true : "Please type a name",
        },
        OneMoreConfirm: {
            type: "confirm",
            name: "update",
            message: "Do you want to add one more??",
        },
        user: {
            type: "list",
            name: "user",
            message: "Select field to update",
        },
        project: {
            type: "list",
            name: "project",
            message: "Select field to update",
        },
        exercise: {
            type: "list",
            name: "exercise",
            message: "Select field to update",
        },
    },
    delete: {
        repo: {
            type: "input",
            name: "repo_name",
            message: "Do you want to search by this name ?",
            validate: (input) => input != "" ? true : "Please type a name",
        },
        confirm: {
            type: "confirm",
            name: "delete",
            message: "Are you sure you want to delete it ?",
        },
        list: {
            type: "list",
            name: "repo_selected",
            message: "Select manually the project or exercise to delete",
        },
    },
    add: {
        user: {
            type: "input",
            name: "user_name",
            message: "type your github username",
            default: db.get("user.github_username").value(),
            validate: (input) => input != "" ? true : "Please type a github username",
        },
        repo: {
            type: "input",
            name: "repo_name",
            message: "type the repository`s name to add",
            validate: (input) => input != "" ? true : "Please type a repository`s name",
        },
        confirm: {
            type: "confirm",
            name: "isRepoWantToSave",
            message: "Is this the repository you would like to add ?",
        },
        project: {
            status: {
                type: "list",
                name: "status",
                message: "what is the status of this project",
                choices: ["starting", "working", "pending", "completed"],
            },
            image: {
                type: "input",
                name: "image",
                message: "if you want to add an image put it in the dir src/assets/images and type the name file",
                validate: (input) => {
                    if (input === "") return true
                    const url = path.join(__dirname, `../src/assets/images/${input}`)
                    if (fs.existsSync(url)) {
                        return true
                    } else {
                        return `This file no exists: ${url}`
                    }
                }
            },
            technologies: {
                type: "input",
                name: "technologies",
                message: "type the technologies that use this project",

            },
            repo_related_name: {
                type: "input",
                name: "repo_related_name",
                message: "type a repository related with this project",
            },
            repo_related_url: {
                type: "input",
                name: "repo_related_url",
                message: "type the url repository related",
            },
            addMoreConfirm: {
                type: "confirm",
                name: "add",
                message: "Do you want to add one more??",
            },
        },
        exercise: {
            status: {
                type: "list",
                name: "status",
                message: "what is the status of this project",
                choices: ["starting", "working", "pending", "completed"],
            },
            image: {
                type: "input",
                name: "image",
                message: "if you want to add an image put it in the dir src/assets/images and type the name file",
                validate: (input) => {
                    if (input === "") return true
                    const url = path.join(__dirname, `../src/assets/images/${input}`)
                    if (fs.existsSync(url)) {
                        return true
                    } else {
                        return `This file no exists: ${url}`
                    }
                }
            },
            technologies: {
                type: "input",
                name: "technologies",
                message: "type the technologies that use this project",

            },
            repo_related_name: {
                type: "input",
                name: "repo_related_name",
                message: "type a repository related with this project",
            },
            repo_related_url: {
                type: "input",
                name: "repo_related_url",
                message: "type the url repository related",
            },
            addMoreConfirm: {
                type: "confirm",
                name: "add",
                message: "Do you want to add one more??",
            },
            reference_source: {
                type: "list",
                name: "reference_source",
                message: "select the source to which this exercise belongs",
                choices: ["personal", "course", "tutorial", "book"],
            },
            reference_url: {
                type: "input",
                name: "reference_url",
                message: "type the url to the source",
            }

        }
    }
}
const textBanner = {
    add: [
        "Description:\n",
        "You can add new project or exercise to post into your website.",
        "Please follow the steps below to complete the operation successfully.",
        "Thanks!"
    ],
    update: [
        "Description:\n",
        "You can update a project, exercise or user information posted into your website.",
        "Please follow the steps below to complete the operation successfully.",
        "Thanks!"
    ],
    delete: [
        "Description:\n",
        "You can delete a project or exercise posted into your website.",
        "Please follow the steps below to complete the operation successfully.",
        "Thanks!"
    ],
    list: [
        "Description:\n",
        "You can list the user information, projects, exercises, lastest project completed, the repos list actually working or all database saved",
        "Please follow the steps below to complete the operation successfully.",
        "Thanks!"
    ]
}
async function getUserAndRepoNames(name) {
    if (name) questions.add.repo.default = name
    let res = await inquirer.prompt([
        questions.add.user,
        questions.add.repo,
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
async function getTypeFromUser() {
    let res = await inquirer.prompt([
        questions.type,
    ])
    return res
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
            questions.add.exercise.status,
            questions.add.exercise.image,
        ])
        newProject.status = res.status;
        if (res.image != "") {
            newProject.image_url = `assets/images/${res.image}`;
        }
        do {
            res = await inquirer.prompt([
                questions.add.exercise.technologies,
            ])
            if (res.technologies === "") {
                res.add = false
                break
            }
            technologies.push(res.technologies)
            res = await inquirer.prompt([
                questions.add.exercise.addMoreConfirm,
            ])
        }
        while (res.add)
        do {
            const repo_related = {
                name: "",
                url: ""
            }
            res = await inquirer.prompt([
                questions.add.exercise.repo_related_name,
            ])
            if (res.repo_related_name === "") {
                res.add = false
                break
            }
            repo_related.name = res.repo_related_name;
            res = await inquirer.prompt([
                questions.add.exercise.repo_related_url,
            ])
            repo_related.url = res.repo_related_url;
            repos_related.push(repo_related);
            res = await inquirer.prompt([
                questions.add.exercise.addMoreConfirm,
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
            questions.add.exercise.status,
            questions.add.exercise.image,
        ])
        newExercise.status = res.status;
        if (res.image != "") {
            newExercise.image_url = `assets/images/${res.image}`;
        }
        do {
            res = await inquirer.prompt([
                questions.add.exercise.technologies,
            ])
            if (res.technologies === "") {
                res.add = false
                break
            }
            technologies.push(res.technologies)
            res = await inquirer.prompt([
                questions.add.exercise.addMoreConfirm,
            ])
        }
        while (res.add)
        do {
            const repo_related = {
                name: "",
                url: ""
            }
            res = await inquirer.prompt([
                questions.add.exercise.repo_related_name,
            ])
            if (res.repo_related_name === "") {
                res.add = false
                break
            }
            repo_related.name = res.repo_related_name;
            res = await inquirer.prompt([
                questions.add.exercise.repo_related_url,
            ])
            repo_related.url = res.repo_related_url;
            repos_related.push(repo_related);
            res = await inquirer.prompt([
                questions.add.exercise.addMoreConfirm,
            ])
        }
        while (res.add)
        newExercise.technologies = technologies;
        newExercise.repos_related = repos_related;
        res = await inquirer.prompt([
            questions.add.exercise.reference_source,
        ])
        newExercise.reference.source = res.reference_source;
        if (res.reference_source != "personal") {
            res = await inquirer.prompt([
                questions.add.exercise.reference_url
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
function printTextsByCommandIntoBanner(command) {
    const texts = textBanner[command]
    for (const text of texts) {
        console.log(`${text}`)
    }
    console.log("\n")
}
function banner(command) {
    cfonts.say("Welcome", {
        font: 'block',
        align: 'left',
        colors: ['system'],
        background: 'transparent',
        letterSpacing: 1,
        lineHeight: 1,
        space: true,
        maxLength: '0',
        gradient: false,
        independentGradient: false,
        transitionGradient: false,
        env: 'node'
    });
    console.log("Content Management System")
    console.log("Version 0.1.0")
    console.log("Visit: https://krisemm.github.io/KrisEmm/\n")
    console.log(`Command Selected: ${command} \n`)
    printTextsByCommandIntoBanner(command)
}
async function interfaceAddCommand(name, isProjectSelected, isExerciseSelected) {
    try {
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
            questions.add.confirm,
        ])
        if (!res.isRepoWantToSave) {
            console.log("Sorry, Try it again")
            return
        }
        if (!isProjectSelected && !isExerciseSelected) {
            const type = await getTypeFromUser()
            setInfoExtra(repoInfo.repo, type)
        } else {
            const type = isExerciseSelected ? "exercise" : "project"
            setInfoExtra(repoInfo.repo, type)
        }
    } catch (error) {
        console.log(error)
    }
}
function generateQuestion(field, value) {
    let question = {
        type: "",
        name: "",
        message: "",
        default: "",
    }
    if (field === "id" || field === "type" || field === "registeredAt") {
        console.log("Sorry, You can not modify this field.")
        return question = {}
    }
    if (typeof value === "string") {
        if (field === "image_url") {
            question.type = "input"
            question.name = field
            question.message = "type the new name file to update, remember put the image in the dir src/assets/images"
            question.validate = (input) => {
                if (input === "") return true
                const url = path.join(__dirname, `../src/assets/images/${input}`)
                if (fs.existsSync(url)) {
                    return true
                } else {
                    return `This file no exists: ${url}`
                }
            }
            return question
        }
        if (field === "status") {
            question.type = "list"
            question.name = "status"
            question.message = "what is the status of this project"
            question.choices = ["starting", "working", "pending", "completed"]
            question.default = value
            return question
        }
        question.type = "input"
        question.name = field
        question.message = "type the new value to update"
        question.default = value
        return question
    }
    if (typeof value === "object") {
        if (Array.isArray(value) && value.length > 0) {
            question.type = "list"
            question.name = field
            question.message = "Select the value to update"
            question.choices = [...value, "Add New"]
            return question
        }
        if (Array.isArray(value) && value.length === 0) {
            question.type = "input"
            question.name = field
            question.message = "type the new value to update"
            question.default = value
            return question
        }
        question.type = "list"
        question.name = field
        question.message = "Select the value to update"
        question.choices = [...Object.keys(value), "Add New"]
        return question
    }
    if (typeof value === "number") {
        question.type = "number"
        question.name = field
        question.message = "type the new value to update"
        question.default = value
        return question
    }
    return question = {}
}
async function updateField(field, value, target, id) {
    if (typeof value[0] === "object") {
        let updatedTarget = null;
        const names = value.map(val => val.name)
        let nameObjectSelected = await inquirer.prompt([
            {
                type: "list",
                name: field,
                message: "Select the value to update",
                choices: [...names, "Add New"]
            }
        ])
        if (nameObjectSelected[field] === "Add New") {
            const choices = {
                repos_related: ["name", "url"],
                requirements: [],
                install: [],
                run: []
            }
            const newObject = {}
            for (const key of choices[field]) {
                let valueKeyAdded = await inquirer.prompt([
                    {
                        type: "input",
                        name: key,
                        message: `Add value to ${key} new ${field}`,
                        validate: (input) => input != "" ? true : "Please type a name",
                    }
                ])
                newObject[key] = valueKeyAdded[key]
            }
            value.push(newObject)
        } else {
            const objectSelected = value.filter(val => val.name === nameObjectSelected[field])[0]
            let keySelected = await inquirer.prompt([
                {
                    type: "list",
                    name: nameObjectSelected[field],
                    message: "Select the value to update",
                    choices: Object.keys(objectSelected)
                }
            ])
            let valueKeySelected = await inquirer.prompt([
                {
                    type: "input",
                    name: keySelected[nameObjectSelected[field]],
                    message: "Select the value to update",
                    default: objectSelected[keySelected[nameObjectSelected[field]]]
                }
            ])
            if (valueKeySelected[keySelected[nameObjectSelected[field]]] === "") {
                value.splice(value.findIndex(val => val.name === nameObjectSelected[field], 1))
            } else {
                value[value.findIndex(val => val.name === nameObjectSelected[field])][keySelected[nameObjectSelected[field]]] = valueKeySelected[keySelected[nameObjectSelected[field]]]

            }
        }
        updatedTarget = updateFieldIntoDb(field, value, target, id)
        console.clear()
        console.log(`the field: ${field} updated successfully`)
        console.log(updatedTarget)
        console.log("\n")
        console.log("Do not forget to see these changes on your website enter the following commands")
        console.log("\n")
        console.log("git add src/data/db.json")
        console.log("git commit")
        console.log("git push origin master")
        return
    }
    let newQuestion = generateQuestion(field, value)
    let addNewValueToList = false
    let updatedTarget = null;
    let valueSelectedFromListQuestion = null
    if (Object.keys(newQuestion).length === 0) return
    if (newQuestion.type === "list" && field != "status") {
        let fieldChanged = await inquirer.prompt([
            newQuestion
        ])
        if (fieldChanged[field] === "Add New") {
            addNewValueToList = true
        }
        newQuestion = generateQuestion(field, "")
        valueSelectedFromListQuestion = fieldChanged[field]
    }
    let fieldChanged = await inquirer.prompt([
        newQuestion
    ])
    if (typeof value === "object" && !Array.isArray(value)) {
        if (addNewValueToList) {
            if (fieldChanged[field] === "") {
                fieldChanged[field] = value
            } else {
                const newFieldAdded = fieldChanged[field]
                value[newFieldAdded] = ""
                addNewValueToList = false
                newQuestion = generateQuestion(newFieldAdded, "")
                let newValueToFieldAdded = await inquirer.prompt([
                    newQuestion
                ])
                value[newFieldAdded] = newValueToFieldAdded[newFieldAdded]
                fieldChanged[field] = value
            }
        } else {
            if (fieldChanged[field] === "") {
                delete value[valueSelectedFromListQuestion]
                fieldChanged[field] = value
            } else {
                value[valueSelectedFromListQuestion] = fieldChanged[field]
                fieldChanged[field] = value
            }
        }
    }
    if (Array.isArray(value) && value.length === 0) fieldChanged[field] = [fieldChanged[field]]
    if (Array.isArray(value) && value.length > 0) {
        if (addNewValueToList) {
            if (typeoffieldChanged[field] != "") {
                fieldChanged[field] = [...value, fieldChanged[field]]
                addNewValueToList = false

            } else {
                fieldChanged[field] = value
            }
        } else {
            if (fieldChanged[field] === "") {
                fieldChanged[field] = value.filter(val => val != valueSelectedFromListQuestion)

            } else {
                value[value.indexOf(valueSelectedFromListQuestion)] = fieldChanged[field]
                fieldChanged[field] = value
            }
        }
    }
    if (field == "image_url" && fieldChanged[field] != "") fieldChanged[field] = `assets/images/${fieldChanged[field]}`
    updatedTarget = updateFieldIntoDb(field, fieldChanged[field], target, id)
    console.clear()
    console.log(`the field: ${field} updated successfully`)
    console.log(updatedTarget)
    console.log("\n")
    console.log("Do not forget to see these changes on your website enter the following commands")
    console.log("\n")
    console.log("git add src/data/db.json")
    console.log("git commit")
    console.log("git push origin master")
    return
}
function updateFieldIntoDb(field, newValue, target, id) {
    if (target === "user") {
        db.get(target).assign({ [field]: newValue }).write()
        const updatedTarget = db.get(target).value()
        return updatedTarget
    }
    db.get("repositories").find({ id: id }).assign({ [field]: newValue }).write()
    if (target === "projects" || target === "exercises") {
        db.get("lastest_repos").find({ id: id }).assign({ [field]: newValue }).write()
    }
    if (target === "projects") {
        db.get("lastest_project").assign({ [field]: newValue }).write()
    }
    const updatedTarget = db.get("repositories").filter({ id: id }).value()
    return updatedTarget[0]
}
async function interfaceUpdateCommand(name, options) {
    try {
        if (Object.entries(options).length === 0) {
            const optionSelected = await inquirer.prompt([
                questions.update.list
            ])
            console.log(optionSelected.option)
            if (optionSelected.option === "user") {
                const result = db.get(optionSelected.option).value()
                console.log("Result:")
                console.log(result)
                questions.update.user.choices = Object.keys(result)
                const fieldSelected = await inquirer.prompt([
                    questions.update.user,
                ])
                console.log("Field Selected:")
                console.log(fieldSelected.user)
                console.log("Value:")
                console.log(result[fieldSelected.user])
                updateField(fieldSelected.user, result[fieldSelected.user], optionSelected.option)
                return
            }
            const list = optionSelected.option === "exercise" ? "exercises" : "projects"
            if (name) questions.update.repo.default = name
            let repoNameSeleted = await inquirer.prompt([
                questions.update.repo,
            ])
            name = repoNameSeleted.name
            const repo = db.get("repositories").filter({ type: optionSelected.option }).filter({ name: name }).value()
            if (repo.length <= 0) {
                console.log(`there is no match with ${name} name into ${list} list`)
                return
            }
            console.log("Result:")
            console.log(repo[0])
            questions.update[optionSelected.option].choices = Object.keys(repo[0])
            let fieldSelected = await inquirer.prompt([
                questions.update[optionSelected.option],
            ])
            console.log("Field Selected:")
            console.log(fieldSelected[optionSelected.option])
            console.log("Value:")
            console.log(repo[0][fieldSelected[optionSelected.option]])
            updateField(fieldSelected[optionSelected.option], repo[0][fieldSelected[optionSelected.option]], list, repo[0].id)

            return
        }
        const optionSelected = Object.keys(options)
        console.log("Option Selected:")
        console.log(optionSelected)
        if (optionSelected[0] === "user") {
            const result = db.get(optionSelected).value()
            console.log("Result:")
            console.log(result)
            questions.update.user.choices = Object.keys(result)
            const fieldSelected = await inquirer.prompt([
                questions.update.user,
            ])
            console.log("Field Selected:")
            console.log(fieldSelected.user)
            console.log("Value:")
            console.log(result[fieldSelected.user])
            updateField(fieldSelected.user, result[fieldSelected.user], optionSelected[0])
            return
        }
        const list = optionSelected[0] === "exercise" ? "exercises" : "projects"
        if (name) questions.update.repo.default = name
        let repoNameSeleted = await inquirer.prompt([
            questions.update.repo,
        ])
        name = repoNameSeleted.name
        const repo = db.get("repositories").filter({ type: optionSelected[0] }).filter({ name: name }).value()
        if (repo.length <= 0) {
            console.log(`there is no match with ${name} name into ${list} list`)
            return
        }
        console.log("Result:")
        console.log(repo[0])
        questions.update[optionSelected[0]].choices = Object.keys(repo[0])
        let fieldSelected = await inquirer.prompt([
            questions.update[optionSelected[0]],
        ])
        console.log("Field Selected:")
        console.log(fieldSelected[optionSelected[0]])
        console.log("Value:")
        console.log(repo[0][fieldSelected[optionSelected[0]]])
        updateField(fieldSelected[optionSelected[0]], repo[0][fieldSelected[optionSelected[0]]], list, repo[0].id)

        return
    } catch (error) {

    }
}

async function deleteWithNameRepo(name, type) {
    const list = type === "project" ? "projects" : "exercises"
    questions.delete.repo.default = name
    let repoNameSeleted = await inquirer.prompt([
        questions.delete.repo,
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
        questions.delete.confirm,
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
    questions.delete.list.choices = result
    const repoNameSeleted = await inquirer.prompt([
        questions.delete.list,
    ])
    const repo = db.get("repositories").filter({ type: type, name: repoNameSeleted.repo_selected }).value()
    console.log(repo)
    const res = await inquirer.prompt([
        questions.delete.confirm,
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
async function interfaceDeleteCommand(name, isProjectSelected, isExerciseSelected) {
    try {
        if (!isProjectSelected && !isExerciseSelected) {
            const type = await getTypeFromUser()
            if (!name) {
                deleteWithoutNameRepo(type.name)
            } else {
                deleteWithNameRepo(name, type.name)
            }
        } else {
            const type = isExerciseSelected ? "exercise" : "project"
            if (!name) {
                deleteWithoutNameRepo(type)
            } else {
                deleteWithNameRepo(name, type)
            }
        }
    } catch (error) {

    }
}
async function interfaceListCommand(options) {
    if (Object.entries(options).length === 0) {
        const optionSelected = await inquirer.prompt([
            questions.list
        ])
        if (optionSelected.option === "all") {
            console.log(`Result:`)
            console.log(db.getState())
            return
        }
        if (optionSelected.option === "projects" || optionSelected.option === "exercises") {
            const type = optionSelected.option === "exercises" ? "exercise" : "project";
            const result = db.get("repositories").filter({ type: type }).value()
            console.log(`Result:`)
            console.log(result)
            return
        }
        const result = db.get(optionSelected.option).value()
        console.log(`Result:`)
        console.log(result)
        return
    }
    const optionSelected = Object.keys(options)
    if (optionSelected[0] === "all") {
        console.log(`Opcion Selected:`)
        console.log(optionSelected)
        console.log("\n")
        console.log(`Result:`)
        console.log(db.getState())
        return
    }
    if (optionSelected[0] === "projects" || optionSelected[0] === "exercises") {
        const type = optionSelected[0] === "exercises" ? "exercise" : "project";
        const result = db.get("repositories").filter({ type: type }).value()
        console.log(`Result:`)
        console.log(result)
        return
    }
    const result = db.get(optionSelected).value()
    console.log(`Opcion Selected:`)
    console.log(optionSelected)
    console.log("\n")
    console.log(`Result:`)
    console.log(result)
}
program
    .version('0.1.0')
    .description('Content Management System in a Command Line Interface for my personal portfolio and website.')
program
    .addHelpText("afterAll", "Visit: https://krisemm.github.io/KrisEmm/")

program
    .command("add")
    .arguments("[name]>", "name project or exercise")
    .option("-p, --project", "add new project")
    .option("-e, --exercise", "add new exercise")
    .description("Add new project or exercise")
    .action((name, options, command) => {
        if (Object.entries(options).length > 1) {
            console.log("it is not valid to put more than one option for this command")
            return
        }
        banner(command.name());
        interfaceAddCommand(name, options.project, options.exercise);
    })

program
    .command("update")
    .arguments("[name]", "name project or exercise to update")
    .option("-u, --user", "update user")
    .option("-e, --exercise", "update exercise")
    .option("-p, --project", "update project")
    .description("Update project or exercise, and user information")
    .action((name, options, command) => {
        if (Object.entries(options).length > 1) {
            console.log("it is not valid to put more than one option for this command")
            return
        }
        banner(command.name());
        interfaceUpdateCommand(name, options);
    })

program
    .command("delete")
    .arguments("[name]", "name project or exercise to delete")
    .option("-p, --project", "delete project")
    .option("-e, --exercise", "delete exercise")
    .description("Delete project or exercise")
    .action((name, options, command) => {
        if (Object.entries(options).length > 1) {
            console.log("it is not valid to put more than one option for this command")
            return
        }
        banner(command.name());
        interfaceDeleteCommand(name, options.project, options.exercise);
    })

program
    .command("list")
    .option("-u, --user", "list user information")
    .option("-p, --projects", "list all project")
    .option("-e, --exercises", "list all exercise")
    .option("-l, --lastest_project", "show lastest project")
    .option("-r, --lastest_repos", "list all repositories currently working")
    .option("-a, --all", "list all database")
    .description("List user information, projects, exercises or all db")
    .action((options) => {
        if (Object.entries(options).length > 1) {
            console.log("it is not valid to put more than one option for this command")
            return
        }
        banner("list");
        interfaceListCommand(options);
    })



program.parse(process.argv)
