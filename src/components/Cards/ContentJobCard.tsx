import { Icon24LikeOutline } from "@vkontakte/icons";
import { Spacing, Title, Text, Div, ButtonGroup, Button } from "@vkontakte/vkui";

type JobContentProp = {
  vacancy: string;
  workExperience: string;
  employmentType: string;
}

const ContentJobCard:React.FC<JobContentProp> = ({vacancy, workExperience, employmentType}) => {
  return (
    <>
      <Title level="3">{vacancy}</Title>

      <Spacing size="xl" />

      <Div style={{display: 'flex', flexDirection: 'row', gap: '5px'}}>
        <div style={{padding: '8px', border: '1px solid #7b7b7b', borderRadius: '20px'}}>
          <Text>{workExperience}</Text>
        </div>
        <div style={{padding: '8px', border: '1px solid #7b7b7b', borderRadius: '20px'}}>
          <Text>{employmentType}</Text>
        </div>
      </Div>

      <Spacing size="xl" />

      <ButtonGroup mode="horizontal" gap="m">
        <Button mode="tertiary">
          <Icon24LikeOutline />
        </Button>
        <Button 
          className='btnStudent' hoverClassName='btnStudentHover' 
          mode="secondary">
            Откликнуться
        </Button>
      </ButtonGroup>
    </>
  )
}

export default ContentJobCard;