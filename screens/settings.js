import { Pressable, Image, StyleSheet } from "react-native";
import { useContext, useState } from "react";

import { settingsLabels } from "../utils/translations";
import { getColor } from "../utils/functions";
import { SettingsContext } from "../utils/hooks";
import { themeColors } from "../utils/colors";

import { BodyText, LabelText, PlanlyModal, PlanlyScreen, PlanlyScroll, PlanlyView } from "../components/basics";
import { Warning } from "../components/modals";


function SettingOption({img,label,selected,onSelect,value,tinted=true}){
    const color = getColor(useContext(SettingsContext).thm);

    if(selected){
        return (
            <PlanlyView style={styles.item}>
                <PlanlyView style={styles.selected}>
                {tinted?
                    <Image style={styles.img} source={img} tintColor={themeColors[color]} />:
                    <Image style={styles.img} source={img} />
                }
                </PlanlyView>
                <BodyText>{label}</BodyText>
            </PlanlyView>
        );
    } else {
        return (
            <Pressable style={styles.item} onPress={()=>onSelect(value)}>
                {tinted?
                    <Image style={styles.img} source={img} tintColor={themeColors[color]} />:
                    <Image style={styles.img} source={img} />
                }
                <BodyText style={styles.gray}>{label}</BodyText>
            </Pressable>
        );
    }
}

function SettingItem({type,onChange}){
    const color = getColor(useContext(SettingsContext).thm);
    const lang = useContext(SettingsContext).lang;

    const current = useContext(SettingsContext)[type];

    const [inst,setInst] = useState(false);

    const change = (value)=>{
        onChange(type,value);
        if(type==='lang'){
            setInst(true);
        }
    };

    return (
        <PlanlyView>
            <PlanlyView style={{...styles.block,shadowColor:themeColors[color]}} transparent={false}>
                <LabelText>{settingsLabels[type][lang].title}</LabelText>
                <PlanlyView style={styles.row}>
                    {[...Array(settingsAssets[type].values.length).keys()].map(i=>
                        <SettingOption img={settingsAssets[type].icons[i]} label={settingsLabels[type][lang].options[i]} selected={current===settingsAssets[type].values[i]} value={settingsAssets[type].values[i]} onSelect={change} tinted={type!=='thm'} key={i} />
                    )}
                </PlanlyView>
            </PlanlyView>
            <PlanlyModal show={inst} setShow={setInst}>
                <Warning message={settingsLabels.langWarn.label[lang]} labels={settingsLabels.langWarn.button[lang]} actions={[()=>setInst(false)]} />
            </PlanlyModal>
        </PlanlyView>
    );
}

export default function Settings({dispatch}){

    const update = (type,value) => {
        dispatch({
            field: type,
            value: value,
        });
    };

    return (
        <PlanlyScreen><PlanlyScroll>
            {Object.keys(settingsAssets).map(type=>
                <SettingItem type={type} onChange={update} key={type} />
            )}
        </PlanlyScroll></PlanlyScreen>
    );
}

const styles = StyleSheet.create({
    block: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        gap: 16,
        padding: 16,
        borderRadius: 16,
        elevation: 4,
    },
    row: {
        display: 'flex',
        flexDirection: 'row',
        gap: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    item: {
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    img: {
        width: 48,
        height: 48,
    },
    selected: {
        padding: 6,
        borderColor: themeColors.primary.original,
        borderWidth: 2,
        borderRadius: 32,
    },
    gray: {
        color: themeColors.gray,
    },
});

const settingsAssets = {
	thm: {
		icons: [
			require('../assets/icons/theme-auto.png'),
			require('../assets/icons/theme-dark.png'),
			require('../assets/icons/theme-light.png'),
		],
		values: ['auto', 'dark', 'light'],
	},
	lang: {
		icons: [
			require('../assets/icons/lang-en.png'),
			require('../assets/icons/lang-fa.png'),
		],
		values: ['en','fa']
	},
	ds: {
		icons: [
			require('../assets/icons/date-intl.png'),
			require('../assets/icons/date-usa.png'),
		],
		values: ['intl','usa'],
	},
	ws: {
		icons: [
			require('../assets/icons/day-saturday.png'),
			require('../assets/icons/day-sunday.png'),
			require('../assets/icons/day-monday.png'),
		],
		values: [6,0,1],
	},
};