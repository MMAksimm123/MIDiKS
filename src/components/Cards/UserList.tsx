import React, { useEffect, useState } from "react";
import { Avatar, Banner, ScreenSpinner} from "@vkontakte/vkui";
import { supabase } from "../../database/supabaseClient";
import ContentUserCard from "./ContentUserCard";

export type User = {
  id: string;
  id_vk_student: string;
  full_name_student: string;
  specialization_of_study: string;
  url_vk_student_photo: string;
  student_vacancy: string;
  student_work_experience: string;
  student_last_place_of_employment: string;
  student_employment_type: string;
};

interface UserListProps {
  searchQuery?: string;
}

const UserList: React.FC<UserListProps> = ({searchQuery = "" }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const { data, error: supabaseError } = await supabase
          .from("Students")
          .select("*");

        if (supabaseError) throw supabaseError;

        console.log("Received data:", data);
        setUsers(data || []);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err instanceof Error ? err.message : "Неизвестная ошибка");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => 
    (user.student_vacancy || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <ScreenSpinner />;
  }

  if (error) return <div>Ошибка: {error}</div>;
  
  if (users.length === 0) return <div>Пользователи не найдены</div>;

  return (
    <div style={{ padding: '16px' }}>
      {filteredUsers.map((user) => (
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
          style={{ marginBottom: '12px' }}
          actions={
            <ContentUserCard 
              id={user.id} // Передаем id карточки
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

export default UserList;