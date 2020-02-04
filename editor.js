const axios = require('axios');

const fs = require('fs');

const params = process.argv.filter((v, i) => i >= 2);

const helpMessage = "" +
    "/n     Insert new word.                Usage: node editor.js /n \"filename\" \"word\" \"definition\" \"type\" \"pronunciation\"\n" +
    "/h     Show list of all commands.      Usage: node editor js /h\n"
const notRecognizedCmdMessage = "'$COMMAND' is not recognized command. Type /h to see all commands."

const cmdName = params[0];

const typeAlias = {
    "phrasal verb": "PHR_V",
    "noun": "N",
    "verb": "V",
    "adjective": "ADJ",
    "idiom": "IDIOM"
}

function pushNewWord(filename, word, definition, type, pronunciation) {

    const current = JSON.parse(fs.readFileSync("words/" + filename));

    current.push({ word, definition, type, pronunciation })

    fs.writeFileSync("words/" + filename, JSON.stringify(current));
}

async function autofillWord(filename, word) {

    let out = (await axios.get("https://www.oxfordlearnersdictionaries.com/search/english/direct/?q=" + word.replace(" ", "+"))).data;

    const wordFindTag = "<h1 class=\"headword\"";
    const definitionFindTag = "<span class=\"def\"";
    const typeFindTag = "<span class=\"pos\"";
    const pronunciationFindTag = "<span class=\"phon\">";

    let wordBeginIndex = out.indexOf(wordFindTag);
    if (wordBeginIndex == -1) {
        console.error("[ERROR] Could not autofill \"" + word + "\" word definition - not found in oxford dictionary");
        return;
    }

    let foundWord = out.substring(wordBeginIndex + wordFindTag.length);
    foundWord = foundWord.substring(foundWord.indexOf(">") + 1);
    foundWord = foundWord.substring(0, foundWord.indexOf("</h1>"));

    if (foundWord !== word) {
        console.error("[ERROR] Could not autofill \"" + word + "\" word definition - found \"" + foundWord + "\"");
        return;
    }

    let definition = out.substring(out.indexOf(definitionFindTag) + definitionFindTag.length);
    definition = definition.substring(definition.indexOf(">") + 1, definition.indexOf("</span>"));
    let type = out.substring(out.indexOf(typeFindTag) + typeFindTag.length);
    type = type.substring(type.indexOf(">") + 1, type.indexOf("</span>"));
    if (typeAlias[type] === undefined) {
        console.warn("[WARNING] Could not find \"" + type + "\" in alias - replaced with UNKNWN");
        type = "UNKNWN";
    } else {
        type = typeAlias[type];
    }
    let pronunciation = out.substring(out.indexOf(pronunciationFindTag) + pronunciationFindTag.length);
    pronunciation = pronunciation.substring(0, pronunciation.indexOf("</span>"));
    pushNewWord(filename, word, definition, type, pronunciation);

}

switch (cmdName) {
    case '/h':
        console.log(helpMessage);
        break;
    case '/n':
        pushNewWord(params[1], params[2], params[3], params[4], params[5]);
        break;
    case '/a':
        autofillWord(params[1], params[2]);
        break;
    default:
        console.log(notRecognizedCmdMessage.replace("$COMMAND", cmdName));
        break;
}