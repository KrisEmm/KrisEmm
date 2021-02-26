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

const adapter = new FileSync("./src/data/db.json");
const db = low(adapter);
const maxLengthToLastestRepos = 3;
const questions = {
    add: {
        user: {
            type: "input",
            name: "user_name",
            message: "type your github username",
            default: "KrisEmm",
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
        type: {
            type: "list",
            name: "name",
            message: "what type is the repository you want to add ?",
            choices: ["project", "exercise"],
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
                message: "do you want to add one more??",
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
                message: "do you want to add one more??",
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
        "You are trying add new project or exercise to post into your website.",
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
            lenguages: {},
            githubpage: ""
        }
        const github_url = `https://api.github.com/repos/${user_name}/${repo_name}`;
        const res = await axios.get(github_url);
        repo.id = res.data.id;
        repo.name = res.data.name;
        repo.description = res.data.description;
        repo.source = res.data.html_url;
        repo.githubpage = res.data.homepage;
        const resLenguages = await axios.get(res.data.languages_url);
        repo.lenguages = Object.keys(resLenguages.data);
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
        questions.add.type,
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
        newProject.lenguages = repo.lenguages;
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
        db.get('projects').unshift(newProject).write();
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
        newExercise.lenguages = repo.lenguages;
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
        db.get('exercises').unshift(newExercise).write();
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
        banner(command.name());
        interfaceAddCommand(name, options.project, options.exercise);
    })

program
    .command("update")
    .arguments("<name>", "name project or exercise")
    .option("-p, --project", "type project")
    .option("-e, --exercise", "type exercise")
    .description("Update project or exercise")
    .action((name, options, command) => {
        console.log(name)
        console.log(options.exercise)
        console.log(options.project)
        console.log(command.name())
        //bienvenida
        //sin no coloca option solicitar si es projecto o ejercicio
        //nombre del proyecto o ejercicio a buscar
        //buscar en db
        //mostrar resultado
        //si exite seleccionar campo a modificar bucle hasta confirmar
    })

program
    .command("delete")
    .arguments("<name>", "name project or exercise")
    .option("-p, --project", "type project")
    .option("-e, --exercise", "type exercise")
    .description("Delete project or exercise")
    .action((name, options, command) => {
        console.log(name)
        console.log(options.exercise)
        console.log(options.project)
        console.log(command.name())
        //bienvenida
        //sin no coloca option solicitar si es projecto o ejercicio
        //nombre del proyecto o ejercicio a eliminar
        //buscar en db
        //mostrar resultado
        //si exite confirmar eliminacion
    })

program
    .command("list")
    .option("-p, --project", "list all project")
    .option("-e, --exercise", "list all exercise")
    .option("-a, --all", "list all database")
    .option("-l, --lastest", "show lastest project")
    .option("-c, --currently", "list all repositories currently working")
    .description("List projects, exercises or db")
    .action((options, command) => {
        console.log(options.exercise)
        console.log(options.project)
        console.log(options.all)
        console.log(options.lastest)
        console.log(options.currently)
        console.log(command.name())
        //bienvenida
        //sin no coloca option solicitar si es projecto o ejercicio o all etc
        //buscar en db
        //mostrar resultado
    })



program.parse(process.argv)
