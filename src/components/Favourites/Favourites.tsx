import { Avatar, Banner, Spinner } from "@vkontakte/vkui";
import ContentUserCard from "../Cards/ContentUserCard";
import { useEffect, useState } from "react";
import bridge from "@vkontakte/vk-bridge";
import { supabase } from "../../database/supabaseClient";

interface Student {
  id: string;
  full_name_student: string;
  url_vk_student_photo: string;
  specialization_of_study: string;
  student_vacancy: string;
  student_work_experience: string;
  student_last_place_of_employment: string;
  student_employment_type: string;
}

const Favorites = () => {
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

                // Получаем ID карточек
                const cardIds = favoritesData.map((item) => item.id_card_favoriterite);

                // Получаем данные студентов по ID карточек
                const { data: studentsData, error: studentsError } = await supabase
                    .from("Students")
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
    <div style={{ padding: "16px" }}>
      {favorites.map((user) => (
        <Banner
          key={user.id}
          before={
            <Avatar
              size={48}
              src={user.url_vk_student_photo}
              alt={user.full_name_student}
              onError={() => console.error("Failed to load avatar for", user.full_name_student)}
            />
          }
          title={user.full_name_student}
          subtitle={user.specialization_of_study}
          style={{ marginBottom: "12px" }}
          actions={
            <ContentUserCard
              id={user.id}
              vacancy={user.student_vacancy}
              workExperience={user.student_work_experience}
              lastPlaceOfEmployment={user.student_last_place_of_employment}
              employmentType={user.student_employment_type}
            />
          }
        />
      ))}
    </div>
  );
};

export default Favorites;