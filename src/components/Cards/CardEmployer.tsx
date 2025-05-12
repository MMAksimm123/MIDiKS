import { Banner, Link } from "@vkontakte/vkui";

type ContentEmployer = {
    nameCompany: string;
    companyDescription: string;
    companyLink: string;
}

const CardEmployer:React.FC<ContentEmployer> = ({nameCompany, companyDescription, companyLink}) => {
    return (
        <Banner
            title={nameCompany}
            subtitle={companyDescription}
            actions={<Link href={companyLink}>Ссылка на сайт</Link>}
        />
    )
}

export default CardEmployer;