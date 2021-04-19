#!/usr/bin/env node
const cfonts = require('cfonts');
const { textBanner } = require("./messages")
const { program } = require('commander');
const { interfaceAddCommand } = require("./crud/create")
const { interfaceUpdateCommand } = require("./crud/update")
const { interfaceDeleteCommand } = require("./crud/delete")
const { interfaceListCommand } = require("./crud/read")
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
    const texts = textBanner[command]
    for (const text of texts) {
        console.log(`${text}`)
    }
    console.log("\n")
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
    .option("-c, --course", "add new course")
    .description("Add new project, exercise or course")
    .action((name, options, command) => {
        if (Object.entries(options).length > 1) {
            console.log("it is not valid to put more than one option for this command")
            return
        }
        banner(command.name());
        interfaceAddCommand(name, options.project, options.exercise, options.course);
    })

program
    .command("update")
    .arguments("[name]", "name project or exercise to update")
    .option("-u, --user", "update user")
    .option("-e, --exercise", "update exercise")
    .option("-p, --project", "update project")
    .option("-c, --course", "update course")
    .description("Update project, exercise, course or user information")
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
    .option("-c, --course", "delete course")
    .description("Delete project or exercise")
    .action((name, options, command) => {
        if (Object.entries(options).length > 1) {
            console.log("it is not valid to put more than one option for this command")
            return
        }
        banner(command.name());
        interfaceDeleteCommand(name, options.project, options.exercise, options.course);
    })

program
    .command("list")
    .option("-u, --user", "list user information")
    .option("-p, --projects", "list all project")
    .option("-e, --exercises", "list all exercise")
    .option("-c, --courses", "list all courses")
    .option("-l, --lastest_project", "show lastest project")
    .option("-r, --lastest_repos", "list all repositories currently working")
    .option("-cl, --lastest_courses_learning", "list all courses currently learning")
    .option("-cc, --lastest_courses_completed", "list all courses completed")
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
