import { Icon24LikeOutline, Icon24Like } from "@vkontakte/icons";
import { Title, Text, ButtonGroup, Button, Spacing } from "@vkontakte/vkui";
import React, { useState, useEffect } from "react";
import bridge from "@vkontakte/vk-bridge";
import { supabase } from "../../database/supabaseClient";

type StudentContentProp = {
    id: string;
    workExperience: string;
    lastPlaceOfEmployment: string;
    vacancy?: string;
    employmentType?: string;
    onActionClick?: (e: React.MouseEvent) => void;
}

const ContentUserCard: React.FC<StudentContentProp> = ({id, vacancy, workExperience, lastPlaceOfEmployment, employmentType, onActionClick}) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const [loading, setLoading] = useState(false);
    const [inviteStatus, setInviteStatus] = useState<'idle' | 'loading' | 'sent'>('idle');

    useEffect(() => {
        const checkFavoriteStatus = async () => {
            try {
                const user = await bridge.send('VKWebAppGetUserInfo');
                const vkId = user.id;

                // Проверяем статус избранного
                const { data: favoriteData } = await supabase
                    .from('Favourites')
                    .select('*')
                    .eq('id_user', vkId)
                    .eq('id_card_favoriterite', id)
                    .single();

                // Проверяем статус приглашения
                const { data: invitationData } = await supabase
                    .from('Invitations')
                    .select('*')
                    .eq('id_vk_employear', vkId)
                    .eq('id_card', id)
                    .single();

                setIsFavorite(!!favoriteData);
                setInviteStatus(invitationData ? 'sent' : 'idle');
            } catch (error) {
                console.error('Error checking statuses:', error);
            }
        };

        checkFavoriteStatus();
    }, [id]);

    const handleFavoriteClick = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onActionClick) onActionClick(e);
        try {
            setLoading(true);
            const user = await bridge.send('VKWebAppGetUserInfo');
            const vkId = user.id;

            if (isFavorite) {
                const { error } = await supabase
                    .from('Favourites')
                    .delete()
                    .eq('id_user', vkId)
                    .eq('id_card_favoriterite', id);

                if (!error) {
                    setIsFavorite(false);
                }
            } else {
                const { error } = await supabase
                    .from('Favourites')
                    .insert([
                        { 
                            id_user: vkId, 
                            id_card_favoriterite: id 
                        }
                    ]);

                if (!error) {
                    setIsFavorite(true);
                }
            }
        } catch (error) {
            console.error('Error handling favorite:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInviteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onActionClick) onActionClick(e);
    try {
        setInviteStatus('loading');
        const user = await bridge.send('VKWebAppGetUserInfo');
        const vkEmployerId = user.id;

        // Получаем данные студента
        const { data: studentData, error: studentError } = await supabase
            .from('Summary')
            .select('vk_id_student, vacancies')
            .eq('id', id)
            .single();

        if (studentError || !studentData) {
            throw studentError || new Error('Student not found');
        }

        // Получаем данные работодателя
        const { data: employerData, error: employerError } = await supabase
            .from('Employers')
            .select('company_name')
            .eq('id_vk_employer', vkEmployerId)
            .single();

        if (employerError || !employerData) {
            throw employerError || new Error('Employer not found');
        }

        // Отправляем приглашение
        const { error: inviteError } = await supabase
            .from('Invitations')
            .insert([
                {
                    id_vk_employear: vkEmployerId,
                    id_vk_student: studentData.vk_id_student,
                    id_card: id
                }
            ]);

        if (inviteError) {
            throw inviteError;
        }

        // Создаем уведомление
        const { error: noticeError } = await supabase
            .from('Notices_Student')
            .insert([
                {
                    vk_id_student: studentData.vk_id_student,
                    vk_id_employer: vkEmployerId,
                    id_card: id,
                    reviewed: false,
                }
            ]);

        if (noticeError) {
            throw noticeError;
        }

        setInviteStatus('sent');
    } catch (error) {
        console.error('Error sending invitation:', error);
        setInviteStatus('idle');
    }
};

    const getInviteButtonText = () => {
        switch (inviteStatus) {
            case 'loading':
                return 'Отправка...';
            case 'sent':
                return 'Приглашение отправлено';
            default:
                return 'Пригласить';
        }
    };

    return (
        <>
            <Title level="3">{vacancy}</Title>

            <Spacing size="xl" />

            <Text>Опыт работы: {workExperience}</Text>
            <Text>Последнее место работы: {lastPlaceOfEmployment}</Text>
            <Text>Тип занятости: {employmentType}</Text>

            <Spacing size="xl" />

            <ButtonGroup mode="horizontal" gap="m">
                <Button 
                    mode="tertiary" 
                    onClick={handleFavoriteClick}
                    disabled={loading}
                >
                    {isFavorite ? <Icon24Like fill="#fc4c00"/> : <Icon24LikeOutline fill="#fc4c00"/>}
                </Button>
                <Button 
                    className='btnStudent' 
                    hoverClassName='btnStudentHover' 
                    mode="secondary"
                    onClick={handleInviteClick}
                    disabled={inviteStatus !== 'idle'}
                >
                    {getInviteButtonText()}
                </Button>
            </ButtonGroup>
        </>
    );
}

export default ContentUserCard;