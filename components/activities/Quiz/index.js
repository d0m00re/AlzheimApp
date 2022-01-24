import React, { useEffect, useState } from 'react';
import { View, BackHandler } from 'react-native';
import { Text } from 'react-native-elements';

import Menu from './Menu';

// Child components
import ViewQuiz from './ViewQuiz';
import CreateQuiz from './Edition/CreateQuiz';

import * as API from '../../../data/quizApi';

import styles from './styles';

export default function Quiz(props) {
    const [isLoading, setIsLoading] = useState(true);
    const [tab, setTab] = useState(0);
    const [quiz, setQuiz] = useState([]);

    useEffect(() => {
        // API.reset();

        API.get(props.personId).then((data) => {
            // setQuiz(['test'])
            if (data.length > 0) {
                setQuiz(data);
            }
            setIsLoading(false);
        });

        // BackHandler managment
        const backAction = () => {
            if (tab > 0) {
                setTab(0);
            } else {
                props.setPage(null);
            }
            return true;
        };
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction
        );
        return () => {
            backHandler.remove();
        };
    }, [tab]);

    const printPage = () => {
        if (tab === 0) {
            return (
                <Menu
                    setTab={setTab}
                    lang={props.lang}
                    setPage={props.setPage}
                    quiz={quiz}
                />
            );
        } else if (tab === 1) {
            return <Text>Tab 1 (Play?)</Text>;
        } else if (tab === 2) {
            return (
                <ViewQuiz
                    loading={isLoading}
                    setTab={setTab}
                    lang={props.lang}
                    setPage={props.setPage}
                    quiz={quiz}
                />
            );
        } else if (tab === 3) {
            return <Text>Tab 3 (Help?)</Text>;
        } else if (tab === 4) {
            return (
                <CreateQuiz
                    personId={props.personId}
                    setTab={setTab}
                    lang={props.lang}
                    setPage={props.setPage}
                />
            );
        } else {
            return <Text>Invalid tab</Text>;
        }
    };

    return <View style={styles.view}>{printPage()}</View>;
}