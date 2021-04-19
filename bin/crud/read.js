const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const inquirer = require('inquirer');
const { forms } = require("../forms")
const adapter = new FileSync("./src/data/db.json");
const db = low(adapter);
module.exports.interfaceListCommand = async function (options) {
    if (Object.entries(options).length === 0) {
        const optionSelected = await inquirer.prompt([
            forms.list
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