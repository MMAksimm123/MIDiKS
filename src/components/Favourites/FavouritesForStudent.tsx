import bridge from "@vkontakte/vk-bridge";
import { useEffect, useState } from "react";
import { supabase } from "../../database/supabaseClient";
import { Banner, Spinner } from "@vkontakte/vkui";
import ContentJobCard from "../Cards/ContentJobCard";

interface Student {
    id: string;
    vk_id_employer: string;
    company_name: string;
    position: string;
    work_experience: string;
    type_employment: string;
}

const FavouritesForStudent = () => {
    const [favorites, setFavorites] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                // Получаем VK ID пользователя через bridge
                const vkUser = await bridge.send("VKWebAppGetUserInfo");
                const vkId = vkUser.id;
                
                // Получаем избранные карточки пользователя из таблицы Favorites
                const { data: favoritesData, error: favoritesError } = await supabase
                    .from("Favourites")
                    .select("id_card_favoriterite")
                    .eq("id_user", vkId);
    
                if (favoritesError) throw favoritesError;
    
                if (!favoritesData || favoritesData.length === 0) {
                    setLoading(false);
                    return;
                }
    
                const cardIds = favoritesData.map((item) => item.id_card_favoriterite);
    
                const { data: studentsData, error: studentsError } = await supabase
                    .from("Vacancies")
                    .select("*")
                    .in("id", cardIds);
    
                if (studentsError) throw studentsError;
    
                setFavorites(studentsData || []);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching favorites:", err);
                // setError("Не удалось загрузить избранное");
                setLoading(false);
            }
        };
    
        fetchFavorites();
    }, []);

    if (loading) {
        return (
          <div style={{ display: "flex", justifyContent: "center", padding: "20px" }}>
            <Spinner size="l" />
          </div>
        );
    }

    if (error) {
        return <div style={{ color: "red", padding: "16px" }}>{error}</div>;
    }

    if (favorites.length === 0) {
        return <div style={{ padding: "16px" }}>У вас пока нет избранных вакансий</div>;
    }

    return (
        <div style={{padding: "16px"}}>
            {favorites.map((vacancies) => (
                <Banner 
                    key={vacancies.id}
                    title={vacancies.company_name}
                    actions={
                        <ContentJobCard id={vacancies.id} 
                            vacancy={vacancies.position}
                            workExperience={vacancies.work_experience}
                            employmentType={vacancies.type_employment}
                        />
                    }
                />
            ))}
        </div>
    )
}

export default FavouritesForStudent;