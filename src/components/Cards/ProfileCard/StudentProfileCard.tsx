import { Avatar, Banner } from "@vkontakte/vkui";
import React from "react";
import ContentUserProfile from "./ContentUserProfile";

type ContentCard = {
  idVkStudent: string;
  urlPhoto: string;
  name: string;
  specialization: string;
  studentVacancy: string;
  studentWorkExpiriency: string;
  studentLastPlaceEmployment: string;
  studentEmploymentType: string;
};

const StudentProfileCard: React.FC<ContentCard> = ({ idVkStudent, urlPhoto, 
  name, specialization, 
  studentVacancy, studentWorkExpiriency, 
  studentLastPlaceEmployment, studentEmploymentType }) => {
  return (
    <Banner
          key={idVkStudent}
          before={
            <Avatar 
              size={48} 
              src={urlPhoto} 
              alt={name}
              onError={() => console.error("Failed to load avatar for", name)}
            />
          }
          title={name}
          subtitle={specialization}
          style={{ marginBottom: '12px' }} // Добавляем отступ между баннерами
          actions={
            <ContentUserProfile  
              id={idVkStudent}
              vacancy={studentVacancy} 
              workExperience={studentWorkExpiriency}
              lastPlaceOfEmployment={studentLastPlaceEmployment} 
              employmentType={studentEmploymentType}
            />
          }
        />
  );
};

export default StudentProfileCard;