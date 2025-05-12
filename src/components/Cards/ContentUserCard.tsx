import { Icon24LikeOutline, Icon24Like } from "@vkontakte/icons";
import { Title, Text, ButtonGroup, Button, Spacing } from "@vkontakte/vkui";
import React, { useState, useEffect } from "react";
import bridge from "@vkontakte/vk-bridge";
import { supabase } from "../../database/supabaseClient";

type StudentContentProp = {
    id: string; // Добавляем id карточки
    vacancy: string;
    workExperience: string;
    lastPlaceOfEmployment: string;
    employmentType: string;
}

const ContentUserCard: React.FC<StudentContentProp> = ({id, vacancy, workExperience, lastPlaceOfEmployment, employmentType}) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const checkFavoriteStatus = async () => {
            try {
                const user = await bridge.send('VKWebAppGetUserInfo');
                const vkId = user.id;

                const { data, error } = await supabase
                    .from('Favourites')
                    .select('*')
                    .eq('id_user', vkId)
                    .eq('id_card_favoriterite', id)
                    .single();

                if (data) {
                    setIsFavorite(true);
                }
            } catch (error) {
                console.error('Error checking favorite status:', error);
            }
        };

        checkFavoriteStatus();
    }, [id]);

    const handleFavoriteClick = async () => {
        try {
            setLoading(true);
            const user = await bridge.send('VKWebAppGetUserInfo');
            const vkId = user.id;

            if (isFavorite) {
                // Удаляем из избранного
                const { error } = await supabase
                    .from('Favourites')
                    .delete()
                    .eq('id_user', vkId)
                    .eq('id_card_favoriterite', id);

                if (!error) {
                    setIsFavorite(false);
                }
            } else {
                // Добавляем в избранное
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
                    {isFavorite ? <Icon24Like /> : <Icon24LikeOutline />}
                </Button>
                <Button 
                    className='btnStudent' 
                    hoverClassName='btnStudentHover' 
                    mode="secondary"
                >
                    Пригласить
                </Button>
            </ButtonGroup>
        </>
    );
}

export default ContentUserCard;