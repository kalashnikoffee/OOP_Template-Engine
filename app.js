const Manager = require("./lib/Manager.js");
const Engineer = require("./lib/Engineer.js");
const Intern = require("./lib/Intern.js");
const questions = require("./lib/questions.js");
const generateMainHtml = require("./lib/generateMainHtml");
const inquirer = require("inquirer");
const fs = require("fs");
const util = require("util");

const writeFileAsync = util.promisify(fs.writeFile);

init();

async function init() {
  try {
    const team = await buildTeam();
    let html = generateMainHtml(team);
    await writeFileAsync("./output/team.html", html);
    console.log("Team page successfully built!");
    console.log("File saved to ./output/team.html");
  } catch (err) {
    console.log(err);
  }
}

async function buildTeam() {
  let team = [];
  let manager;
  let buildingTeam = (
    await inquirer.prompt([
      {
        type: "confirm",
        message: "Do you want to build a team page?",
        name: "buildingTeam"
      }
    ])
  ).buildingTeam;
  console.clear();

  while (buildingTeam) {
    if (!manager) {
      manager = await inquirer.prompt(questions.manager);
      team.push(
        new Manager(
          manager.name,
          manager.idNumber,
          manager.email,
          manager.uniqueProp
        )
      );
      console.clear();
    }

    let nextMember = await inquirer.prompt(questions.nextMember);

    if (nextMember.position === "engineer") {
      let engineer = await inquirer.prompt(questions.engineer);
      team.push(
        new Engineer(
          engineer.name,
          engineer.idNumber,
          engineer.email,
          engineer.uniqueProp
        )
      );
    } else if (nextMember.position === "intern") {
      let intern = await inquirer.prompt(questions.intern);
      team.push(
        new Intern(
          intern.name,
          intern.idNumber,
          intern.email,
          intern.uniqueProp
        )
      );
    } else {
      buildingTeam = false;
    }
    console.clear();
  }
  return team;
}
