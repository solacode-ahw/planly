import { StyleSheet } from "react-native";
import { useContext, useEffect, useRef, useState } from "react";

import { deleteArchived, getArchived } from "../utils/data";
import { weekDays, archiveRemoveWarning, archiveDate, noArchive } from "../utils/translations";
import { SettingsContext } from "../utils/hooks";

import { BodyText, LabelText, PlanlyModal, PlanlyScreen, PlanlyScroll, PlanlyView } from "../components/basics";
import { TapButton } from "../components/buttons";
import { ViewArchive, Warning } from "../components/modals";


function ArchivedItem({archived,onDel}){
    const dateStyle = useContext(SettingsContext).ds;
    const lang = useContext(SettingsContext).lang;

    const [view,setView] = useState(false);
    const [warn,setWarn] = useState(false);

    const del = ()=>{
        setWarn(false);
        setView(false);
        onDel(archived.id);
    };

    return (
        <PlanlyView>
            <PlanlyView style={styles.row}>
                <LabelText style={styles.label}>{archived.date.display(dateStyle,weekDays[lang],archiveDate[lang])}</LabelText>
                <TapButton icon='view' action={()=>setView(true)} />
                <TapButton icon='bin' action={()=>setWarn(true)} />
            </PlanlyView>
            <PlanlyModal show={view} setShow={setView}>
                <ViewArchive date={archived.date.display(dateStyle,weekDays[lang],archiveDate[lang])} grats={archived.gratitude} tasks={archived.tasks} back={()=>setView(false)} onDel={()=>setWarn(true)} />
            </PlanlyModal>
            <PlanlyModal show={warn} setShow={setWarn}>
                <Warning message={archiveRemoveWarning.message[lang]} labels={archiveRemoveWarning.labels[lang]} actions={[()=>setWarn(false),del]} />
            </PlanlyModal>
        </PlanlyView>
    );
}

export default function Archive({cur}){
    const lang = useContext(SettingsContext).lang;
    
    const archives = useRef([]);
    const [loaded,setLoaded] = useState(false);
    const [load,setLoad] = useState(0);

    useEffect(()=>{
        const getAll = async()=>{
            archives.current = await getArchived();
            setLoaded(true);
        };
        setLoaded(false);
        getAll();
    },[cur,load]);

    const del = async(id)=>{
        await deleteArchived(id);
        setLoad(load+1);
    };

    if(!loaded){
        return null;
    } else {
        return (
            <PlanlyScreen>
                <PlanlyScroll>
                    {archives.current.length?null:
                        <BodyText style={styles.center}>{noArchive[lang]}</BodyText>
                    }
                    {archives.current.map(archived=>
                        <ArchivedItem archived={archived} key={archived.id} onDel={del} />
                    )}
                </PlanlyScroll>
            </PlanlyScreen>
        );
    }
}

const styles = StyleSheet.create({
    row: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20
    },
    label: {
        display: 'flex',
        flexGrow: 1,
        flexShrink: 1,
        alignContent: 'stretch',
    },
    center: {
        textAlign: 'center',
    }
});