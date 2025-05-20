import { Title, Text, Spacing } from "@vkontakte/vkui";
import React, { useState, useEffect } from "react";
import bridge from "@vkontakte/vk-bridge";
import { supabase } from "../../../database/supabaseClient";

type StudentContentProp = {
    id: string;
    vacancy: string;
    workExperience: string;
    lastPlaceOfEmployment: string;
    employmentType: string;
}

const ContentUserProfile: React.FC<StudentContentProp> = ({id, vacancy, workExperience, lastPlaceOfEmployment, employmentType}) => {
    const [isFavorite, setIsFavorite] = useState(false);
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

    return (
        <>
            <Title level="3">{vacancy}</Title>

            <Spacing size="xl" />

            <Text>Опыт работы: {workExperience}</Text>
            <Text>Последнее место работы: {lastPlaceOfEmployment}</Text>
            <Text>Тип занятости: {employmentType}</Text>
        </>
    );
}

export default ContentUserProfile;