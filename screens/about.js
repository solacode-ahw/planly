import { setStringAsync } from "expo-clipboard";
import { openURL } from "expo-linking";
import { StyleSheet, Image, Pressable } from "react-native";
import { useContext } from "react";

import { about } from "../utils/translations";
import { SettingsContext } from "../utils/hooks";
import { themeColors } from "../utils/colors";

import { BodyText, LabelText, PlanlyScreen, PlanlyScroll, PlanlyView } from "../components/basics";
import { IconTextButton, TapButton } from "../components/buttons";


function CopyItem({text}){
    return (
        <PlanlyView style={styles.copy}>
            <BodyText style={styles.copyText}>{text}</BodyText>
            <TapButton icon='copy' action={()=>setStringAsync(text)} />
        </PlanlyView>
    );
}

function LinkItem({label,link}){
    return (
        <Pressable onPress={()=>openURL(link)}>
            <BodyText style={styles.link}>{label}</BodyText>
        </Pressable>
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
                <PlanlyView style={styles.card}>
                    <LabelText>{about.resources[lang]}</LabelText>
                    <PlanlyView style={styles.creditRow}>
                        <BodyText>{about.icons[lang][0]} :</BodyText>
                        <LinkItem label={about.icons[lang][1]} link={about.icons[lang][2]} />
                    </PlanlyView>
                    <PlanlyView style={styles.creditRow}>
                        <BodyText>{about.font[lang][0]} :</BodyText>
                        <LinkItem label={about.font[lang][1]} link={about.font[lang][2]} />
                    </PlanlyView>
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
    creditRow: {
        display: 'flex',
        flexDirection: 'row',
        gap: 6,
        paddingHorizontal: 16,
    },
    link: {
        color: themeColors.primary.original,
        textDecorationLine: 'underline',
        textDecorationColor: themeColors.primary.original,
    },
});