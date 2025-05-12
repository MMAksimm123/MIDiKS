import { FC, useEffect, useState } from 'react';
import { Panel, NavIdProps, FixedLayout, Div, Button, Snackbar, Spacing, PanelHeaderButton, Title } from "@vkontakte/vkui";
import "../style/Home.css";
import { Icon28ArrowLeftOutline, Icon16Done, Icon56ErrorOutline } from '@vkontakte/icons';
import PhoneInput from '../components/InputsForm/PhoneInput';
import SelectedInput from '../components/InputsForm/SelectedInput';
import NumericInput from '../components/InputsForm/NumericInput';
import SelectedDirection from '../components/InputsForm/SelectedInputs/SelectedDirection';
import ChipsSelectedSpeciality from '../components/InputsForm/SelectedInputs/ChipsSelectedSpeciality';
import DefaultInput from '../components/InputsForm/DefoultInput';
import { supabase } from '../database/supabaseClient';
import bridge from '@vkontakte/vk-bridge';

export const StudentRegistration: FC<NavIdProps> = ({id}) => {
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        education: 'higher',
        course: '',
        direction: '',
        specialities: [] as {value: string, label: string}[]
    });

    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState<React.ReactNode | null>(null);
    const [userId, setUserId] = useState<number>(0);
    const [photoUser, setPhotoUser] = useState<string>('');

    const showError = (message: string) => {
        setSnackbar(
            <Snackbar
                before={<Icon56ErrorOutline />}
                onClose={() => setSnackbar(null)}
                layout="vertical"
            >
                {message}
            </Snackbar>
        );
    };

    const showSuccess = (message: string) => {
        setSnackbar(
            <Snackbar
                before={<Icon16Done />}
                onClose={() => setSnackbar(null)}
                layout="vertical"
            >
                {message}
            </Snackbar>
        );
    };

    const handleSubmit = async () => {
        // Валидация данных
        if (!formData.fullName.trim()) {
            showError('Введите ФИО');
            return;
        }

        if (!formData.phone.trim() || formData.phone.replace(/\D/g, '').length < 11) {
            showError('Введите корректный номер телефона');
            return;
        }

        if (!formData.course) {
            showError('Укажите курс');
            return;
        }

        if (!formData.direction) {
            showError('Выберите направление');
            return;
        }

        if (formData.specialities.length === 0) {
            showError('Выберите хотя бы одну специальность');
            return;
        }

        try {
            setLoading(true);

            const { data: existingUser} = await supabase
                .from('Students')
                .select('id_vk_student')
                .eq('id_vk_student', userId)
                .maybeSingle();

            if (existingUser) {
                showError('Пользователь с таким VK ID уже зарегистрирован');
                return;
            }
            
            // Подготовка данных для отправки
            const specialization_of_study = formData.specialities.map(s => s.value).join(', ');
            
            const { data, error } = await supabase
                .from('Students') // Имя вашей таблицы в Supabase
                .insert([{
                    id_vk_student: userId,
                    full_name_student: formData.fullName,
                    phone_number_student: formData.phone,
                    education_level: formData.education,
                    year_of_study: formData.course,
                    direction_of_study: formData.direction,
                    specialization_of_study,
                    url_vk_student_photo: photoUser,
                }])
                .select();

            if (error) {
                throw error;
            }

            showSuccess('Данные успешно сохранены!');
            console.log('Данные сохранены:', data);
            
            // Очистка формы после успешной отправки
            setFormData({
                fullName: '',
                phone: '',
                education: 'higher',
                course: '',
                direction: '',
                specialities: []
            });

        } catch (error) {
            console.error('Ошибка при сохранении данных:', error);
            showError('Произошла ошибка при сохранении данных');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        bridge.send('VKWebAppGetUserInfo')
          .then((userInfo) => {
            const vkUserId = userInfo.id;
            const urlVkUserPhoto = userInfo.photo_100;

            setUserId(vkUserId);
            setPhotoUser(urlVkUserPhoto);
          })
          .catch((error) => {
            console.error('Ошибка получения информации о пользователе VK', error);
          });
      }, []);

    return (
        <Panel id={id}>
            <PanelHeaderButton onClick={() => window.history.back()}>
                <Icon28ArrowLeftOutline fill='fc4c00'/>
                <Spacing size="4xl" />
                {/* <Text>МИДИКС</Text> */}
            </PanelHeaderButton>
            <div style={{textAlign: 'center'}}>
                <Title level="1">Регистрация</Title>
            </div>
            <Div>
                <DefaultInput 
                    title="ФИО" placeholder='Иванов Иван Иванович'
                    id='name' value={formData.fullName} type='text'
                    onChange={(value) => setFormData({...formData, fullName: value})}
                />
                
                <PhoneInput 
                    value={formData.phone}
                    onChange={(value) => setFormData({...formData, phone: value})}
                />
                
                <SelectedInput 
                    value={formData.education}
                    onChange={(value) => setFormData({...formData, education: value})}
                />
                
                <NumericInput 
                    title='Курс' placeholder='' 
                    id='course' maxLength={1}
                    value={formData.course}
                    onChange={(value) => setFormData({...formData, course: value})}
                />
                
                <SelectedDirection 
                    value={formData.direction}
                    onChange={(value) => setFormData({...formData, direction: value})}
                />
                
                <ChipsSelectedSpeciality 
                    value={formData.specialities}
                    onChange={(value) => setFormData({...formData, specialities: value})}
                />
            </Div>
            <Spacing size="4xl" />
            <Spacing size="4xl" />
            
            <FixedLayout vertical='bottom'>
                <Button 
                    className='btnStudent' stretched 
                    mode='secondary' size="l"  
                    hoverClassName='btnStudentHover'
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading ? 'Отправка...' : 'Продолжить'}
                </Button>
            </FixedLayout>

            {snackbar}
        </Panel>
    )
}