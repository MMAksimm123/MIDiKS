import React, { useEffect, useState } from "react";
import { supabase } from "../../database/supabaseClient";
import { Banner, ScreenSpinner } from "@vkontakte/vkui";
import ContentJobCard from "./ContentJobCard";

export type Job = {
  id: string;
  vk_id_employer: string;
  company_name: string;
  position: string;
  work_experience: string;
  type_employment: string;
}

interface JobListProps {
  searchQuery?: string;
}

const JobList:React.FC<JobListProps> = ({searchQuery = ""}) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);

        const {data, error: supabaseError} = await supabase
          .from("Vacancies")
          .select("*");

        if (supabaseError) throw supabaseError;

        console.log("Received data 2:", data);
        setJobs(data || []);
      } catch (err) {
        console.log("Fetch error 2:", err);
        setError(err instanceof Error ? err.message : "Неизвестная ошибка");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  useEffect(() => {
    console.log("Current jobs state:", jobs);
  }, [jobs]);

  const filteredJobs = jobs.filter(user => 
      user.position.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <ScreenSpinner />
  }

  if (error) return <div>Ошибка: {error}</div>;

  if (jobs.length === 0) return <div>Вакансии не найдены</div>

  return (
    <div style={{padding: '16px'}}>
      {filteredJobs.map((job) => (
        <Banner
          key={job.id}
          title={job.company_name}
          style={{marginBottom: '12px'}}
          actions={
            <ContentJobCard vacancy={job.position}
              workExperience={job.work_experience}
              employmentType={job.type_employment}
            />
          }
        />
      ))}
    </div>
  )
}

export default JobList;