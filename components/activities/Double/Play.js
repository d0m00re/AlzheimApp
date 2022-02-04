import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';

import { Button } from 'react-native-elements';

import { lang as DoubleLang } from '../../../language/activities/double';

import styles from './styles';

import { generateRandomPair } from './subs/helpers';

import Card from './subs/Card';

export default function Play(props) {
    const [game, setGame] = useState([...generateRandomPair(4)]); // the current map game
    const [found, setFound] = useState([]);
    const [tries, setTries] = useState(3);
    const [play, setPlay] = useState([]); // the current play of the player, an array with two values max, corresponding to the cards the player played
    const [show, setShow] = useState(true);
    const [pause, setPause] = useState(false);

    // Exemple game element:
    /*
        [
            { idx: 0, color: '#ffffff', icon: null },
            { idx: 1, color: '#ferdnc', icon: null },
            { idx: 2, color: '#ffffff', icon: null },
            { idx: 3, color: '#ferdnc', icon: null }
        ]
    */

        // each play, we push the current card to the play state, and check if the first element exists in the
        // game state, and if the second element is the same as the first one, if so => success for a round, and push
        // this pair in the found state. If fail => clear the play && found states

    // Exemple play element:
    /*
        [
            { idx: 0, color: '#ffffff', icon: null },
            { idx: 2, color: '#ffffff', icon: null }
        ] // this is a successful array

        [
            { idx: 0, color: '#ffffff', icon: null },
            { idx: 1, color: '#ferdnc', icon: null }
        ] // this is a fail array
    */

    const printButton = () => {
        if (show) {
            return (
            <View style={styles.buttonViewPlay}>
                <Button title={DoubleLang[props.lang].Start} onPress={() => setShow(false) } buttonStyle={styles.playButtons} />
            </View>);
        } else {
            return (
            <View style={styles.buttonViewPlay}>
                <Button title={DoubleLang[props.lang].GiveUp} buttonStyle={[styles.playButtons, {backgroundColor: 'red', marginRight: 10}] } />
                <Button title={DoubleLang[props.lang].Reinit} buttonStyle={[styles.playButtons, {backgroundColor: 'green'}]} onPress={() => newModel() } />
            </View>);
        }
    }

    const ReturnCard = (key) => {
        if (pause) return;
        const currentPlay = play;
        const indexGame = game[key];
        const playing = [...currentPlay, indexGame]
        setPlay(playing);
        if (playing.length == 2) {
            // check if same card or return all and lose a try
            if (playing[0].color === playing[1].color && playing[0].icon === playing[1].icon) {
                const nFound = [...found, playing[0], playing[1]];
                setFound(nFound);
                setPlay([]);
            }
        }
    };

    const printCards = () => {
        return game.map( (el, i) => {
            var inFound = false;
            var inPlay = false;
            if (found.find(element => element.idx === i )) inFound = true;
            else if (play.find(element => element.idx === i )) inPlay = true;
            return (<Card show={show} key={i} index={i} inFound={inFound} inPlay={inPlay} backgroundColor={el.color} icon={el.icon} ReturnCard={ReturnCard} />);
        });
    };

    return (
        <>
            <View style={styles.viewGame}>
                { printCards() }
            </View>
            <View style={{alignItems: 'center', width: 100 + '%'}}>
                <Text>{DoubleLang[props.lang].Score(score)}</Text>
                <Text>{DoubleLang[props.lang].RemaningTries(tries)}</Text>
                { printButton() }
            </View>
        </>
    );
};