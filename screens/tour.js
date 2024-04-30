import { StyleSheet, Image, Pressable, I18nManager, Modal } from "react-native";
import { useState, useContext, useEffect } from "react";

import { SettingsContext } from "../utils/hooks";
import { themeColors } from "../utils/colors";
import { getColor } from "../utils/functions";

import { BodyText, PlanlyView } from "../components/basics";


function Action({icon,action,active=true}){
    const color = getColor(useContext(SettingsContext).thm);

    return (
        <Pressable onPress={action} style={styles.actions}>
            <Image source={icons[icon]} style={styles.actions} tintColor={active?themeColors[color]:themeColors.gray} />
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
			<PlanlyView style={styles.modalOut}><PlanlyView transparent={false} style={{...styles.modalIn,shadowColor:themeColors[color]}}>
                <Image source={images[lang][slide]} resizeMode="stretch" style={styles.image} />
                <PlanlyView style={styles.nav}>
                    <Action icon={I18nManager.isRTL?'right':'left'} action={prev} active={slide>0} />
                    <PlanlyView style={styles.indicators}>
                        {[...Array(n).keys()].map(i=><Indicator active={i===slide} key={i} />)}
                    </PlanlyView>
                    <Action icon={I18nManager.isRTL?'left':'right'} action={next} active={slide<n-1}/>
                </PlanlyView>
                <Pressable style={styles.button} onPress={()=>setShow(false)}>
                    <BodyText style={styles.button}>{slide<n-1?message[lang][0]:message[lang][1]}</BodyText>
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
        paddingVertical: 16,
        gap: 16,
        flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'flex-start',
		borderTopRightRadius: 32,
		borderTopLeftRadius: 32,
		elevation: 16,
        backgroundColor: '#F0B955',
    },
    actions: {
        width: 20,
        height: 20,
    },
    indicatorActive: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: themeColors.primary.original,
    },
    indicatorInactive: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: themeColors.primary.lighter,
    },
    image: {
        flex: 1,
        width: '100%',
    },
    imageContainer: {
        flex: 1,
        width: '100%',
    },
    imageStack: {
        position: 'absolute',
        top: 0,
        start: 0,
        width: '100%',
        height: '100%',
    },
    nav: {
        display: 'flex',
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    indicators: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 6,
    },
    button: {
        width: '100%',
        textAlign: 'center',
    },
});

const icons = {
    left: require('../assets/icons/left-light.png'),
    right: require('../assets/icons/right-light.png'),
};

const n = 15;
const images = {
    en: [
        require('../assets/tour/en/01.jpg'),
        require('../assets/tour/en/02.jpg'),
        require('../assets/tour/en/03.jpg'),
        require('../assets/tour/en/04.jpg'),
        require('../assets/tour/en/05.jpg'),
        require('../assets/tour/en/06.jpg'),
        require('../assets/tour/en/07.jpg'),
        require('../assets/tour/en/08.jpg'),
        require('../assets/tour/en/09.jpg'),
        require('../assets/tour/en/10.jpg'),
        require('../assets/tour/en/11.jpg'),
        require('../assets/tour/en/12.jpg'),
        require('../assets/tour/en/13.jpg'),
        require('../assets/tour/en/14.jpg'),
        require('../assets/tour/en/15.jpg'),
    ],
    fa: [
        require('../assets/tour/fa/01.jpg'),
        require('../assets/tour/fa/02.jpg'),
        require('../assets/tour/fa/03.jpg'),
        require('../assets/tour/fa/04.jpg'),
        require('../assets/tour/fa/05.jpg'),
        require('../assets/tour/fa/06.jpg'),
        require('../assets/tour/fa/07.jpg'),
        require('../assets/tour/fa/08.jpg'),
        require('../assets/tour/fa/09.jpg'),
        require('../assets/tour/fa/10.jpg'),
        require('../assets/tour/fa/11.jpg'),
        require('../assets/tour/fa/12.jpg'),
        require('../assets/tour/fa/13.jpg'),
        require('../assets/tour/fa/14.jpg'),
        require('../assets/tour/fa/15.jpg'),
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