import { Text } from 'react-native'

const applyBoldStyle = text => {
    let numberOfItemsAdded = 0;
    const result = text.sentence.split(/\{\d+\}/);
    text.boldText.forEach((boldText, i) => result.splice(++numberOfItemsAdded + i, 0, <Text key={i} style={{fontWeight: 'bold', color: "#3B8EFF"}}>{boldText}</Text>));
    return <Text>{result}</Text>;
};

export const lang = {
    fr: {
        Start: "Enregistrer",
        Pause: "Pause",
        Stop: "Stop",
        Continue: "Continuer",
    },
    en: {
        Start: "Start recording",
        Pause: "Pause recording",
        Stop: "Stop recording",
        Continue: "Continue recording",
    }
};