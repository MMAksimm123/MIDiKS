import { Avatar, Badge, Banner } from "@vkontakte/vkui";

const Notices = () => {
    return (
        <Banner
            before={
                <Avatar 
                    size={48}
                />
            }
            title="Име"
            subtitle="Должность"
        />
    )
}

export default Notices;