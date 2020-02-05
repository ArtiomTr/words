import { AppConfig } from "./components/App";
import { createMuiTheme } from "@material-ui/core";

const config: AppConfig = {

    theme: createMuiTheme({
        typography: {
            body1: {
                fontSize: "0.87rem"
            }
        }
    }),

    tmpDataFilePath: "temp.json",

    actions: [
        {
            name: "Open",
            icon: "folder_open"
        },
        {
            name: "Add group",
            icon: "add"
        }
    ]

};

export default config;