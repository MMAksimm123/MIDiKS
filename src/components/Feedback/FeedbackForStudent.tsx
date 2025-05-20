import bridge from "@vkontakte/vk-bridge";
import { useEffect, useState } from "react";
import { supabase } from "../../database/supabaseClient";
import { Banner, Spinner } from "@vkontakte/vkui";
import ContentJobCard from "../Cards/ContentJobCard";

interface Vacancy {
    id: string;
    vk_id_employer: string;
    company_name: string;
    position: string;
    work_experience: string;
    type_employment: string;
}

const FeedbackForStudent = () => {
    const [feedback, setFeedback] = useState<Vacancy[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                const vkUser = await bridge.send("VKWebAppGetUserInfo");
                const vkId = vkUser.id;

                const {data: feedbackData, error: feedbackError} = await supabase
                    .from("Feedback")
                    .select("id_card_vacancie")
                    .eq("id_vk_student", vkId);

                if (feedbackError) throw feedbackError;

                if (!feedbackData || feedbackData.length === 0) {
                    setLoading(false);
                    return;
                }

                const cardIds = feedbackData.map((item) => item.id_card_vacancie);

                const {data: studentsData, error: studentsError} = await supabase
                    .from("Vacancies")
                    .select("*")
                    .in("id", cardIds);

                if (studentsError) throw studentsData;

                setFeedback(studentsData || []);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching feedback:", err);
                setLoading(false);
            }
        };

        fetchFeedback();
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

    if (feedback.length === 0) {
        return <div style={{ padding: "16px" }}>У вас пока нет откликов на вакансии</div>;
    }

    return (
        <div style={{padding: "16px"}}>
            {feedback.map((feedback) => (
                <Banner 
                    key={feedback.id}
                    title={feedback.company_name}
                    actions={
                        <ContentJobCard id={feedback.id} 
                            vacancy={feedback.position}
                            workExperience={feedback.work_experience}
                            employmentType={feedback.type_employment}
                        />
                    }
                />
            ))}
        </div>
    )
}

export default FeedbackForStudent;