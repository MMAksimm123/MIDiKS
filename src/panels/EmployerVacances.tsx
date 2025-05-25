import { Icon28ArrowLeftOutline } from "@vkontakte/icons";
import { useParams, useRouteNavigator } from "@vkontakte/vk-mini-apps-router";
import { Div, Link, MiniInfoCell, NavIdProps, Panel, PanelHeaderButton, Spacing, Text, Title } from "@vkontakte/vkui";
import React, { useEffect, useState } from "react";
import { supabase } from "../database/supabaseClient";

interface VacanciesData {
    id: string;
    position: string;
    work_experience: string;
    work_schedule: string;
    work_format: string;
    type_employment: string;
    speciality: string;
    duties: string;
    conditions: string;
    skills_and_tools: string;
    requirements: string;
    company_name: string;
}

interface CompanyInfo {
    company_name: string;
    company_description: string;
    link_company: string;
}

export const EmployerVacances: React.FC<NavIdProps> = ({id}) => {
    const routeNavigator = useRouteNavigator();
    const params = useParams<"id">();
    const vacancyId = params?.id;

    const [vacanciesData, setVacanciesData] = useState<VacanciesData | null>(null);
    const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                
                // Получаем данные о вакансии
                const { data: vacancyData, error: vacancyError } = await supabase
                    .from("Vacancies")
                    .select("*")
                    .eq("id", vacancyId)
                    .single();

                if (vacancyError) throw vacancyError;
                if (!vacancyData) throw new Error("Вакансия не найдена");

                setVacanciesData(vacancyData);

                // Получаем данные о компании
                const { data: companyData, error: companyError } = await supabase
                    .from("Employers")
                    .select("company_name, company_description, link_company")
                    .eq("company_name", vacancyData.company_name)
                    .single();

                if (companyError) throw companyError;
                setCompanyInfo(companyData);

            } catch (err) {
                console.error("Error fetching data:", err);
                setError(err instanceof Error ? err.message : "Неизвестная ошибка");
            } finally {
                setLoading(false);
            }
        };

        if (vacancyId) {
            fetchData();
        }
    }, [vacancyId]);

    if (loading) {
        return <div>Загрузка...</div>;
    }

    if (error) {
        return <div>Ошибка: {error}</div>;
    }

    if (!vacanciesData) {
        return <div>Данные о вакансии не найдены</div>;
    }

    return (
        <Panel id={id}>
            <PanelHeaderButton onClick={() => routeNavigator.back()}>
                <Icon28ArrowLeftOutline fill='fc4c00' />
            </PanelHeaderButton>

            <Div>
                <Div style={{border: 'solid 1px black', borderRadius: '20px'}}>
                    {companyInfo?.company_name && <Text>{companyInfo.company_name}</Text>}
                    {companyInfo?.company_description && <Text> - {companyInfo.company_description}</Text>}
                    {companyInfo?.link_company && (
                        <Div>
                            <Link href={companyInfo.link_company} target="_blank">Ссылка на сайт</Link>
                        </Div>
                    )}
                </Div>

                <Spacing size='2xl' />
                
                <Div style={{border: 'solid 1px black', borderRadius: '20px'}}>
                    <Title level="3">{vacanciesData.position}</Title>
                    <MiniInfoCell>Опыт работы: {vacanciesData.work_experience}</MiniInfoCell>
                    <MiniInfoCell>График работы: {vacanciesData.work_schedule}</MiniInfoCell>
                    <MiniInfoCell>Формат работы: {vacanciesData.work_format}</MiniInfoCell>
                    <MiniInfoCell>Тип занятости: {vacanciesData.type_employment}</MiniInfoCell>
                </Div>

                <Spacing size='2xl' />

                <Div>
                    <Title>Специальности:</Title>
                    <Text>{vacanciesData.speciality}</Text>
                </Div>

                <Div>
                    <Title>Описание вакансии:</Title>
                    <Spacing size="xl" />
                    <Text>Обязанности:</Text>
                    <Div>
                        <MiniInfoCell>{vacanciesData.duties}</MiniInfoCell>
                    </Div>
                    <Text>Требования:</Text>
                    <Div>
                        <MiniInfoCell>{vacanciesData.requirements}</MiniInfoCell>
                    </Div>
                    <Text>Необходимые навыки и инструменты:</Text>
                    <Div>
                        <MiniInfoCell>{vacanciesData.skills_and_tools}</MiniInfoCell>
                    </Div>
                    <Text>Условия:</Text>
                    <Div>
                        <MiniInfoCell>{vacanciesData.conditions}</MiniInfoCell>
                    </Div>
                </Div>
            </Div>
        </Panel>
    )
}