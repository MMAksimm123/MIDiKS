import { Title, Text, Spacing, Button, Snackbar } from "@vkontakte/vkui";
import { Icon16Phone, Icon16ErrorCircle, Icon16CheckCircle, Icon16CopyOutline } from "@vkontakte/icons";
import { useState } from "react";

type EmployearProp = {
    idEmployear: string;
    nameCompany: string;
    workingFace: string;
    phoneEmployer: string;
};

const InvitationsEmployearCard: React.FC<EmployearProp> = ({ nameCompany, workingFace, phoneEmployer }) => {
    const [snackbar, setSnackbar] = useState<React.ReactNode | null>(null);
    const [isCopied, setIsCopied] = useState(false);
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
    );

    const copyPhoneToClipboard = () => {
        try {
            const textArea = document.createElement('textarea');
            textArea.value = phoneEmployer;
            textArea.style.position = 'fixed';
            document.body.appendChild(textArea);
            textArea.select();
            
            const successful = document.execCommand('copy');
            document.body.removeChild(textArea);
            
            if (successful) {
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 2000);
            } else {
                throw new Error('Copy failed');
            }
        } catch (err) {
            console.error('Ошибка при копировании:', err);
            setSnackbar(
                <Snackbar
                    onClose={() => setSnackbar(null)}
                    before={<Icon16ErrorCircle />}
                >
                    Не удалось скопировать номер
                </Snackbar>
            );
        }
    };

    const handleCall = () => {
        if (isMobile) {
            window.location.href = `tel:${phoneEmployer}`;
        } else {
            copyPhoneToClipboard();
        }
    };

    return (
        <>
            <Title>{nameCompany}</Title>
            <Spacing size="xl" />
            <Text>Контактное лицо: {workingFace}</Text>
            <Spacing size={8} />
            <Text>Номер для связи: {phoneEmployer}</Text>
            <Spacing size={8} />
            <Button
                    before={isMobile ? <Icon16Phone /> : <Icon16CopyOutline />}
                    size="s"
                    mode="secondary"
                    onClick={handleCall}
                >
                    {isMobile 
                        ? "Позвонить" 
                        : isCopied 
                            ? "Скопировано!" 
                            : "Копировать номер"}
                </Button>
            {snackbar}
        </>
    );
};

export default InvitationsEmployearCard;