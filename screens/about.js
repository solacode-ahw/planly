import { setStringAsync } from "expo-clipboard";
import { StyleSheet, Image } from "react-native";
import { useContext } from "react";

import { about } from "../utils/translations";
import { SettingsContext } from "../utils/hooks";
import { themeColors } from "../utils/colors";

import { BodyText, PlanlyScreen, PlanlyScroll, PlanlyView } from "../components/basics";
import { IconTextButton, TapButton } from "../components/buttons";


function CopyItem({text}){
    return (
        <PlanlyView style={styles.copy}>
            <BodyText style={styles.copyText}>{text}</BodyText>
            <TapButton icon='copy' action={()=>setStringAsync(text)} />
        </PlanlyView>
    );
}

export default function About({setTour}){
    const lang = useContext(SettingsContext).lang;

    return (
        <PlanlyScreen>
            <PlanlyScroll>
                <PlanlyView style={styles.card}>
                    <BodyText>{about.credit[lang]}</BodyText>
                    <Image source={require('../assets/graphics/logo.png')} style={styles.logo} resizeMode="stretch"/>
                </PlanlyView>
                <PlanlyView style={styles.card}>
                    <BodyText>{about.address[lang]}</BodyText>
                    <CopyItem text='https://solacode.ir' />
                </PlanlyView>
                <PlanlyView style={styles.card}>
                    <BodyText>{about.contact[lang]}</BodyText>
                    <CopyItem text='solacode.ahw@proton.me' />
                </PlanlyView>
            </PlanlyScroll>
            <IconTextButton icon='play' label={about.tourButton[lang]} action={()=>setTour(true)} style={styles.button} />
        </PlanlyScreen>
    );
}

const styles = StyleSheet.create({
    button: {
        margin: 32,
        alignSelf: 'center',
    },
    copy: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 20,
        paddingHorizontal: 16,
    },
    copyText: {
        color: themeColors.primary.original,
    },
    card: {
        marginVertical: 16,
        display: 'flex',
        gap: 16,
    },
    logo: {
        width: 150,
        height: 90,
        alignSelf: 'center',
    },
});