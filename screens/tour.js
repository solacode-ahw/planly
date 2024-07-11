import { StyleSheet, Image, Pressable, I18nManager, Modal } from "react-native";
import { useState, useContext, useEffect } from "react";

import { SettingsContext } from "../utils/hooks";
import { themeColors } from "../utils/colors";
import { getColor, getTheme } from "../utils/functions";

import { BodyText, PlanlyView } from "../components/basics";


function Action({icon,action,active=true}){
    const color = getColor(useContext(SettingsContext).thm);

    return (
        <Pressable onPress={action} style={active?styles.actionsOutActive:styles.actionsOutInactive}>
            <Image source={icons[icon]} style={styles.actionsIn} tintColor={active?themeColors.primary.original:themeColors.gray} />
        </Pressable>
    );
}
function Indicator({active}){
    if(active){
        return (
            <PlanlyView style={styles.indicatorActive} />
        );
    } else {
        return (
            <PlanlyView style={styles.indicatorInactive} />
        );
    }
}

export default function Tour({show,setShow}){
    const lang = useContext(SettingsContext).lang;
    const theme = getTheme(useContext(SettingsContext).thm);
    const color = getColor(useContext(SettingsContext).thm);

    const [slide,setSlide] = useState(0);
    useEffect(()=>{
        setSlide(0);
    },[show]);
    const prev = ()=>{
        if(slide>0){
            setSlide(slide-1);
        }
    };
    const next = ()=>{
        if(slide<n-1){
            setSlide(slide+1);
        }
    };

    return (
        <Modal animationType="slide" transparent={true} visible={show} onRequestClose={()=>setShow(false)}>
			<PlanlyView style={styles.modalOut}><PlanlyView transparent={false} style={{...styles.modalIn,shadowColor:themeColors[color],backgroundColor:themeColors[theme]}}>
                <Image source={images[lang][slide]} resizeMode="stretch" style={styles.image} />
                <PlanlyView style={styles.nav}>
                    <Action icon={I18nManager.isRTL?'right':'left'} action={prev} active={slide>0} />
                    <PlanlyView style={styles.indicators}>
                        {[...Array(n).keys()].map(i=><Indicator active={i===slide} key={i} />)}
                    </PlanlyView>
                    <Action icon={I18nManager.isRTL?'left':'right'} action={next} active={slide<n-1}/>
                </PlanlyView>
                <Pressable style={styles.buttonOut} onPress={()=>setShow(false)}>
                    <BodyText style={styles.buttonIn}>{slide<n-1?message[lang][0]:message[lang][1]}</BodyText>
                </Pressable>
            </PlanlyView></PlanlyView>
		</Modal>
    );
}

const styles = StyleSheet.create({
    modalOut: {
        display: 'flex',
		flexGrow: 1,
		flexDirection: 'column',
		justifyContent: 'flex-end',
		alignItems: 'center',
    },
    modalIn: {
        width: '100%',
        height: '97.5%',
        display: 'flex',
        paddingVertical: 32,
        paddingHorizontal: 32,
        gap: 24,
        flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'flex-start',
		borderTopRightRadius: 32,
		borderTopLeftRadius: 32,
		elevation: 16,
    },
    actionsOutActive: {
        padding: 8,
        borderRadius: 8,
        borderColor: themeColors.primary.original,
        borderWidth: 1,
    },
    actionsOutInactive: {
        padding: 8,
        borderRadius: 8,
        borderColor: themeColors.gray,
        borderWidth: 1,
    },
    actionsIn: {
        width: 20,
        height: 20,
    },
    indicatorActive: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: themeColors.primary.original,
    },
    indicatorInactive: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: themeColors.gray,
    },
    image: {
        flex: 1,
        width: '100%',
        borderColor: themeColors.primary.original,
        borderWidth: 1,
        borderRadius: 8,
    },
    nav: {
        display: 'flex',
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    indicators: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 6,
    },
    buttonOut: {
        width: '100%',
        paddingVertical: 6,
        borderRadius: 8,
        borderColor: themeColors.primary.original,
        borderWidth: 1,
    },
    buttonIn: {
        width: '100%',
        textAlign: 'center',
        color: themeColors.primary.original
    },
});

const icons = {
    left: require('../assets/icons/left-light.png'),
    right: require('../assets/icons/right-light.png'),
};

const n = 5;
const images = {
    en: [
        require('../assets/tour/en/1.png'),
        require('../assets/tour/en/2.png'),
        require('../assets/tour/en/3.png'),
        require('../assets/tour/en/4.png'),
        require('../assets/tour/en/5.png'),
    ],
    fa: [
        require('../assets/tour/fa/1.png'),
        require('../assets/tour/fa/2.png'),
        require('../assets/tour/fa/3.png'),
        require('../assets/tour/fa/4.png'),
        require('../assets/tour/fa/5.png'),
    ],
};
const message = {
    en: [
        'SKIP',
        'DONE',
    ],
    fa: [
        'رد کردن',
        'بستن',
    ],
}