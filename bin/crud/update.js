const fs = require('fs')
const path = require('path')
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const inquirer = require('inquirer');
const { forms } = require("../forms")
const adapter = new FileSync("./src/data/db.json");
const db = low(adapter);
module.exports.interfaceUpdateCommand = async function (name, options) {
    try {
        if (Object.entries(options).length === 0) {
            const optionSelected = await inquirer.prompt([
                forms.update.list
            ])
            console.log(optionSelected.option)
            if (optionSelected.option === "user") {
                const result = db.get(optionSelected.option).value()
                console.log("Result:")
                console.log(result)
                forms.update.user.choices = Object.keys(result)
                const fieldSelected = await inquirer.prompt([
                    forms.update.user,
                ])
                console.log("Field Selected:")
                console.log(fieldSelected.user)
                console.log("Value:")
                console.log(result[fieldSelected.user])
                updateField(fieldSelected.user, result[fieldSelected.user], optionSelected.option)
                return
            } else if (optionSelected.option === "course") {
                if (name) forms.update.query.default = name
                let query = await inquirer.prompt([
                    forms.update.query,
                ])
                name = query.value
                const courseSelected = db.get("courses").filter({ name: name }).value()
                console.log(courseSelected[0])
                if (courseSelected.length <= 0) {
                    console.log(`there is no match with ${name} name into courses list`)
                    return
                }
                forms.update.course.choices = Object.keys(courseSelected[0])
                const fieldSelected = await inquirer.prompt([
                    forms.update.course,
                ])
                if (fieldSelected.course === "id") return
                const form = forms.add.course[fieldSelected.course]
                form.default = courseSelected[0][fieldSelected.course]
                const newValue = await inquirer.prompt([
                    form
                ])
                console.log("New Value:")
                console.log(newValue[form.name])
                const updatedTarget = updateFieldIntoDb(
                    fieldSelected.course,
                    newValue[form.name],
                    "courses",
                    courseSelected[0].id)
                console.clear()
                console.log(`the field: ${fieldSelected.course} updated successfully`)
                console.log(updatedTarget)
                console.log("\n")
                console.log("Do not forget to see these changes on your website enter the following commands")
                console.log("\n")
                console.log("git add src/data/db.json")
                console.log("git commit")
                console.log("git push origin master")
                return
            } else {
                const list = optionSelected.option === "exercise" ? "exercises" : "projects"
                if (name) forms.update.repo.default = name
                let repoNameSeleted = await inquirer.prompt([
                    forms.update.repo,
                ])
                name = repoNameSeleted.name
                const repo = db.get("repositories").filter({ type: optionSelected.option }).filter({ name: name }).value()
                if (repo.length <= 0) {
                    console.log(`there is no match with ${name} name into ${list} list`)
                    return
                }
                console.log("Result:")
                console.log(repo[0])
                forms.update[optionSelected.option].choices = Object.keys(repo[0])
                let fieldSelected = await inquirer.prompt([
                    forms.update[optionSelected.option],
                ])
                console.log("Field Selected:")
                console.log(fieldSelected[optionSelected.option])
                console.log("Value:")
                console.log(repo[0][fieldSelected[optionSelected.option]])
                updateField(fieldSelected[optionSelected.option], repo[0][fieldSelected[optionSelected.option]], list, repo[0].id)
                return
            }
        }
        const optionSelected = Object.keys(options)
        console.log("Option Selected:")
        console.log(optionSelected)
        if (optionSelected[0] === "user") {
            const result = db.get(optionSelected).value()
            console.log("Result:")
            console.log(result)
            forms.update.user.choices = Object.keys(result)
            const fieldSelected = await inquirer.prompt([
                forms.update.user,
            ])
            console.log("Field Selected:")
            console.log(fieldSelected.user)
            console.log("Value:")
            console.log(result[fieldSelected.user])
            updateField(fieldSelected.user, result[fieldSelected.user], optionSelected[0])
            return
        } else if (optionSelected[0] === "course") {
            if (name) forms.update.query.default = name
            let query = await inquirer.prompt([
                forms.update.query,
            ])
            name = query.value
            const courseSelected = db.get("courses").filter({ name: name }).value()
            console.log(courseSelected[0])
            if (courseSelected.length <= 0) {
                console.log(`there is no match with ${name} name into courses list`)
                return
            }
            forms.update.course.choices = Object.keys(courseSelected[0])
            const fieldSelected = await inquirer.prompt([
                forms.update.course,
            ])
            if (fieldSelected.course === "id") return
            const form = forms.add.course[fieldSelected.course]
            form.default = courseSelected[0][fieldSelected.course]
            const newValue = await inquirer.prompt([
                form
            ])
            console.log("New Value:")
            console.log(newValue[form.name])
            const updatedTarget = updateFieldIntoDb(
                fieldSelected.course,
                newValue[form.name],
                "courses",
                courseSelected[0].id)
            console.clear()
            console.log(`the field: ${fieldSelected.course} updated successfully`)
            console.log(updatedTarget)
            console.log("\n")
            console.log("Do not forget to see these changes on your website enter the following commands")
            console.log("\n")
            console.log("git add src/data/db.json")
            console.log("git commit")
            console.log("git push origin master")
            return
        } else {
            const list = optionSelected[0] === "exercise" ? "exercises" : "projects"
            if (name) forms.update.repo.default = name
            let repoNameSeleted = await inquirer.prompt([
                forms.update.repo,
            ])
            name = repoNameSeleted.name
            const repo = db.get("repositories").filter({ type: optionSelected[0] }).filter({ name: name }).value()
            if (repo.length <= 0) {
                console.log(`there is no match with ${name} name into ${list} list`)
                return
            }
            console.log("Result:")
            console.log(repo[0])
            forms.update[optionSelected[0]].choices = Object.keys(repo[0])
            let fieldSelected = await inquirer.prompt([
                forms.update[optionSelected[0]],
            ])
            console.log("Field Selected:")
            console.log(fieldSelected[optionSelected[0]])
            console.log("Value:")
            console.log(repo[0][fieldSelected[optionSelected[0]]])
            updateField(fieldSelected[optionSelected[0]], repo[0][fieldSelected[optionSelected[0]]], list, repo[0].id)
            return
        }
    } catch (error) {
        console.log(error)
    }
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
function updateFieldIntoDb(field, newValue, target, id) {
    if (target === "user") {
        db.get(target).assign({ [field]: newValue }).write()
        const updatedTarget = db.get(target).value()
        return updatedTarget
    }
    if (target === "courses") {
        db.get("courses").find({ id: id }).assign({ [field]: newValue }).write()

        const lastestCourseLearining = db.get("lastest_courses_learning").filter({ id: id }).value()
        if (lastestCourseLearining.length > 0) db.get("lastest_courses_learning").find({ id: id }).assign({ [field]: newValue }).write()
        const lastestCourseCompleted = db.get("lastest_courses_learning").filter({ id: id }).value()
        if (lastestCourseCompleted.length > 0) db.get("lastest_courses_completed").find({ id: id }).assign({ [field]: newValue }).write()
        const updatedTarget = db.get("courses").filter({ id: id }).value()
        return updatedTarget[0]
    } else {
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
}