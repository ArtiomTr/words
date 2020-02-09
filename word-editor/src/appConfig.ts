import { AppConfig } from "./components/App";
import { createMuiTheme, createStyles } from "@material-ui/core";

const config: AppConfig = {

    theme: createMuiTheme({
        typography: {
            body1: {
                fontSize: "0.87rem"
            }
        },
        overrides: {
            MuiDialogTitle: createStyles({
                root: {
                    padding: 16
                }
            })
        },
        palette: {
            primary: {
                dark: "#303F9F",
                light: "#C5CAE9",
                main: "#3F51B5",
                contrastText: "#FFFFFF"
            },
            secondary: {

                light: "#009688",
                main: "#00796B",
                dark: "#00796B",
                contrastText: "#FFF"

            },
            error: {
                main: "#B00020"
            }
        }
    }),

    tmpDataFilePath: "temp.json",

    actions: [
        {
            name: "Open",
            icon: "folder_open",
            action: ""
        },
        {
            name: "Add group",
            icon: "add",
            action: "new_group"
        }
    ]

};

export default config;