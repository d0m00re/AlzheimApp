import React, { useState } from 'react';
import {
    View,
    Text,
    SafeAreaView,
} from 'react-native';
import { Button, Icon, Divider, FAB } from 'react-native-elements';

import QuestionList from './Creation/QuestionList';
import ViewQuizList from './ViewQuizList';

import { lang as QuizLang } from '../../../language/activities/quiz';
import FormQuizContent from './Creation/FormQuizContent';

import { Audio } from 'expo-av';

import styles from './styles';

export default function ViewQuiz(props) {
    // if the user is editing or not an existing quiz
    const [edit, setEdit] = useState(false);

    // if the user want to add a question to an existing quiz
    const [newQuestion, setNewQuestion] = useState(false);

    // the existing quiz to edit
    const [quizEdit, setQuizEdit] = useState();

    // the new content to add in an existing quiz
    const [newContent, setNewContent] = useState([]);

    // the states for the quiz edition (add / edit question)
    const [question, setQuestion] = useState();
    const [answers, setAnswers] = useState([]);
    const [uri, setUri] = useState();
    const [filename, setFilename] = useState();
    const [fileType, setFileType] = useState();
    const [isPlaying, setIsPlaying] = useState(false);
    const [sound, setSound] = useState(new Audio.Sound());
    const [success, setSuccess] = useState(false);

    // Add a new question on the list
    const pushContent = () => {
        const push = {
            uri: uri,
            filename: filename,
            answers: answers,
            question: question,
            fileType: fileType
        };
        // Clear the creation form
        setFileType();
        setUri();
        setFilename();
        setAnswers([]);
        setQuestion();

        setNewContent([...newContent, push]);
        setSuccess(true);
    };

    const pauseSound = async () => {
        const getSoundStatus = await sound?.getStatusAsync();
        if (getSoundStatus.isLoaded)
            await sound.pauseAsync();
        setIsPlaying(false);
    };

    const viewPage = () => {
        if (newQuestion) { // if the user wants to set a new question for quiz edition
            return (<FormQuizContent
                        lang={props.lang}
                        setAnswers={setAnswers}
                        setFileType={setFileType}
                        setQuestion={setQuestion}
                        setUri={setUri}
                        setFilename={setFilename}
                        setSuccess={setSuccess}
                        setSound={setSound}
                        setIsPlaying={setIsPlaying}
                        pauseSound={pauseSound}
                        uri={uri}
                        filename={filename}
                        answers={answers}
                        fileType={fileType}
                        question={question}
                        success={success}
                        sound={sound}
                        isPlaying={isPlaying}
                />);
        } else if (edit && !newQuestion) {
             // if the user want to see all the question for the quiz edition
            return (quizEdit.content)?.concat(newContent)?.map((el, i) => {
                return (<QuestionList
                    index={i}
                    key={i}
                    id={quizEdit._id || 0}
                    content={el}
                    contentLength={quizEdit.content.length + newContent.length}
                    lang={props.lang}
                    setQuizEdit={setQuizEdit}
                    quizEdition={true}
                />);
            })
        } else {
             // if the user want to see all the existing quiz for the quiz edition
            return (<ViewQuizList
                quiz={props.quiz}
                loading={props.loading}
                lang={props.lang}
                personId={props.personId}
                setEdit={setEdit}
                setQuizEdit={setQuizEdit}
            />);
        }
    };

    const goBack = () => {
        if (newQuestion)
            setNewQuestion(false);
        else if (edit)
            setEdit(false);
        else
            props.setTab(0);
    };

    const buttonTop = (mode) => {
        if (newQuestion) {
            // add a question button
            if (mode == 'title') return QuizLang[props.lang].AddContent;
            else if (mode == 'disabled') return !(answers.length > 0 && question.length > 2);
            else if (mode == 'onpress') return pushContent();
        } else if (edit) {
            // save the quiz button
            if (mode == 'title') return QuizLang[props.lang].Save;
            else if (mode == 'disabled') return !(answers.length > 0 && question.length > 2);
            else if (mode == 'onpress') return pushContent();
        } else {
            // create a quiz button
            if (mode == 'title') return QuizLang[props.lang].Create;
            else if (mode == 'disabled') false;
            else if (mode == 'onpress') return props.setTab(4);
        }
    };

    return (
        <>
            <View style={{ flexDirection: 'row' }}>
                <Button
                    title={ buttonTop('title') }
                    containerStyle={styles.createButton}
                    icon={
                        <Icon
                            name={edit ? 'save-outline' : 'construct-outline'}
                            type={'ionicon'}
                            color={'white'}
                            size={15}
                            style={{ marginHorizontal: 5 }}
                        />
                    }
                    onPress={() => {
                        buttonTop('onpress')
                    }}
                    disabled={ buttonTop('disabled') }
                />
                <FAB
                    color='red'
                    style={{marginLeft: 20}}
                    size="small"
                    icon={{name: 'caret-back-outline', type: 'ionicon', color:'white' }}
                    onPress={() => goBack() }
                />
            </View>
            <Divider
                color={'grey'}
                width={1}
                style={{ width: 100 + '%', marginTop: 20 }}
            />
            <SafeAreaView style={styles.safeArea}>
                {
                    edit && !newQuestion ?
                    <Button
                        title={QuizLang[props.lang].AddQuestion}
                        icon={
                            <Icon
                                name={'add-circle-outline'}
                                type={'ionicon'}
                                color={'white'}
                                size={15}
                                style={{ marginHorizontal: 5 }}
                            />
                        }
                        onPress={() => setNewQuestion(true) }
                    /> : <></>
                }
                { viewPage() }
            </SafeAreaView>
        </>
    );
}
