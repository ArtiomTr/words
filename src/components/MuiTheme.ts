import { createMuiTheme } from "@material-ui/core";
const theme = createMuiTheme({
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
});

export default theme;