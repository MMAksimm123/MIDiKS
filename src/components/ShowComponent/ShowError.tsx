import { Icon56ErrorOutline } from "@vkontakte/icons";
import { Snackbar } from "@vkontakte/vkui";
import { useState } from "react";

export const showError = (message: string) => {
    const [snackbar, setSnackbar] = useState<React.ReactNode | null>(null);
        setSnackbar(
            <Snackbar
                before={<Icon56ErrorOutline />}
                onClose={() => setSnackbar(null)}
                layout="vertical"
        >
                {message}
            </Snackbar>
        );
    };