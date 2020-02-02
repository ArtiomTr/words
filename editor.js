const fs = require('fs');

const params = process.argv.filter((v, i) => i >= 2);

const helpMessage = "" +
    "/n     Insert new word.                Usage: node editor.js /n \"filename\" \"word\" \"definition\" \"type\" \"pronunciation\"\n" +
    "/h     Show list of all commands.      Usage: node editor js /h\n"
const notRecognizedCmdMessage = "'$COMMAND' is not recognized command. Type /h to see all commands."

const cmdName = params[0];

function pushNewWord(filename, word, definition, type, pronunciation) {

    const current = JSON.parse(fs.readFileSync("words/" + filename));

    current.push({ word, definition, type, pronunciation })

    fs.writeFileSync("words/" + filename, JSON.stringify(current));
}

switch (cmdName) {
    case '/h':
        console.log(helpMessage);
        break;
    case '/n':
        pushNewWord(params[1], params[2], params[3], params[4], params[5]);
        break;
    default:
        console.log(notRecognizedCmdMessage.replace("$COMMAND", cmdName));
        break;
}