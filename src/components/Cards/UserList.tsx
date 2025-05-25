import React, { useEffect, useState } from "react";
import { Avatar, Banner, ScreenSpinner } from "@vkontakte/vkui";
import { supabase } from "../../database/supabaseClient";
import ContentUserCard from "./ContentUserCard";
import { useRouteNavigator } from "@vkontakte/vk-mini-apps-router";

export type User = {
  id: string;
  vk_id_student: string;
  name_student: string;
  specialization_of_study: string;
  url_photo_student: string;
  vacancies: string;
  student_work_experience: string;
  student_last_place_of_employment: string;
  student_employment_type: string;
};

interface UserListProps {
  searchQuery?: string;
}

const UserList: React.FC<UserListProps> = ({ searchQuery = "" }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const routeNavigator = useRouteNavigator();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const { data, error: supabaseError } = await supabase
          .from("Summary")
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
    (user.vacancies || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUserClick = (userId: string) => {
    routeNavigator.push(`/studentsummary/${userId}`);
  };

  if (loading) {
    return <ScreenSpinner />;
  }

  if (error) return <div>Ошибка: {error}</div>;

  if (users.length === 0) return <div>Пользователи не найдены</div>;

  return (
    <div style={{ padding: '16px' }}>
      {filteredUsers.map((user) => (
        <Banner
          onClick={() => {
            console.log('User ID to navigate:', user.vk_id_student); // Добавьте лог
            routeNavigator.push(`/studentsummary/${user.vk_id_student}`);
  }}
          key={user.id}
          before={
            <Avatar
              size={48}
              src={user.url_photo_student}
              alt={user.name_student}
              onError={() => console.error("Failed to load avatar for", user.name_student)}
            />
          }
          title={user.name_student}
          subtitle={user.specialization_of_study}
          style={{ marginBottom: '12px' }}
          actions={
            <ContentUserCard
              id={user.id}
              vacancy={user.vacancies}
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