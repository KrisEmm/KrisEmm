const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync("./src/data/db.json");
const db = low(adapter);
const fs = require('fs')
const path = require('path')

module.exports.forms = {
    type: {
        type: "list",
        name: "name",
        message: "Select the type repository",
        choices: ["project", "exercise", "course"],
    },
    list: {
        type: "list",
        name: "option",
        message: "Select a option to list",
        choices: ["user", "projects", "exercises", "courses", "lastest_courses_learning", "lastest_courses_completed", "lastest_project", "lastest_repos", "all"],
    },
    update: {
        list: {
            type: "list",
            name: "option",
            message: "Select a option to update",
            choices: ["user", "project", "exercise", "course"],
        },
        repo: {
            type: "input",
            name: "name",
            message: "Do you want to search by this name ?",
            validate: (input) => input != "" ? true : "Please type a name",
        },
        query: {
            type: "input",
            name: "value",
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
        course: {
            type: "list",
            name: "course",
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
        query: {
            type: "input",
            name: "value",
            message: "Do you want to search by this name ?",
            validate: (input) => input != "" ? true : "Please type a name",
        },
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
        course: {
            name: {
                type: "input",
                name: "course_name",
                message: "type the course`s name to add",
                validate: (input) => input != "" ? true : "Please type a repository`s name",
            },
            company: {
                type: "input",
                name: "company_name",
                message: "type the company`s name",
                validate: (input) => input != "" ? true : "Please type a repository`s name",
            },
            duration: {
                type: "input",
                name: "duration",
                message: "type the course`s duration",
                default: "0"
            },
            url: {
                type: "input",
                name: "url_course",
                message: "type the url`s course",
                validate: (input) => input != "" ? true : "Please type a repository`s name",
            },
            status: {
                type: "list",
                name: "status",
                message: "Select the status to this course",
                choices: ["learning", "completed"],
                default: "learning"
            },
            image: {
                type: "input",
                name: "image",
                message: "if you want to add an image put it in the dir src/assets/images and type the name file",
                validate: (input) => {
                    if (input === "") return false
                    const url = path.join(__dirname, `../src/assets/images/${input}`)
                    if (fs.existsSync(url)) {
                        return true
                    } else {
                        return `This file no exists: ${url}`
                    }
                }
            },
            certificate: {
                type: "input",
                name: "certificate",
                message: "if you want to add an image put it in the dir src/assets/images and type the name file",
                validate: (input) => {
                    if (input === "") return false
                    const url = path.join(__dirname, `../src/assets/images/${input}`)
                    if (fs.existsSync(url)) {
                        return true
                    } else {
                        return `This file no exists: ${url}`

                    }
                }
            },

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