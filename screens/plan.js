import { StyleSheet } from "react-native";
import { useContext, useEffect, useRef, useState } from "react";

import { dateView, archiveWarning, tasksLabel, gratsLabel, addTaskButton, noTasks } from "../utils/translations";
import { SettingsContext } from "../utils/hooks";
import { getWeekDays } from "../utils/functions";
import { getTask } from "../utils/data";

import { PlanlyScreen, PlanlyScroll, DropDown, PlanlyTextInput, PlanlyView, PlanlyModal, LabelText, BodyText } from "../components/basics";
import { VisionBoard } from "../components/vision";
import { HoverButton, IconTextButton } from "../components/buttons";
import { Warning } from "../components/modals";
import { Picker } from "../components/picker";
import { TaskItem } from "../components/task";


export default function Plan({tDel,tEdit,setCur,setNTask,setCurT,data}){
	const lang = useContext(SettingsContext).lang;
	const ws = useContext(SettingsContext).ws;
	const ds = useContext(SettingsContext).ds;
	const current = data.current;

	const [day,setDay] = useState(current.date.day);
	const [month,setMonth] = useState(current.date.month);
	const [year,setYear] = useState(current.date.year);

	const [grat1,setGrat1] = useState(current.gratitude[0]);
	const [grat2,setGrat2] = useState(current.gratitude[1]);
	const [grat3,setGrat3] = useState(current.gratitude[2]);

	const tmpTasks = useRef([]);
	const [tasks,setTasks] = useState([]);
	const [loaded,setLoaded] = useState(0);
	
	const [warn,setWarn] = useState(false);
	const [picker,setPicker] = useState(false);
	const [refresh,setRefresh] = useState(0);

	useEffect(()=>{
		const get = async(id)=>{
			tmpTasks.current.push(await getTask(id));
			if(id===current.tasks.at(-1)){
				setTasks(tmpTasks.current);
				setLoaded(true);
			}
		};
		if(current.tasks.length===0){
			setTasks([]);
		} else {
			tmpTasks.current = [];
			setLoaded(false);
			current.tasks.forEach(tid=>get(tid));
		}
	},[tDel,tEdit,refresh]);

	const saveDay = ()=>{
		current.date.day = day;
		current.save();
	};
	const saveMonth = ()=>{
		current.date.month = month;
		current.save();
	};
	const saveYear = ()=>{
		current.date.year = year;
		current.save();
	};
	const saveWeekDay = (wd)=>{
		current.date.weekday = (Number(wd)+ws)%7;
		current.save();
	};

	const saveGratitude = (ind)=>{
		current.gratitude[ind] = [grat1,grat2,grat3][ind];
		current.save();
	};

	const pickTask = (id)=>{
		setPicker(false);
		current.tasks.push(id);
		current.save();
		setRefresh(refresh+1);
	}
	const pickAddedTask = (id)=>{
		setNTask(id);
		pickTask(id);
	};
	const removeTask = (id)=>{
		current.tasks = current.tasks.filter(tid=>tid!=id);
		current.save();
		setRefresh(refresh+1);
	};

	const archive = async()=>{
		setWarn(false);
		current.date.day = day;
		current.date.month = month;
		current.date.year = year;
		current.gratitude[0] = grat1;
		current.gratitude[1] = grat2;
		current.gratitude[2] = grat3;
		setCur(await current.archive());
		// clear the page
		setDay('');
		setMonth('');
		setYear('');
		setGrat1('');
		setGrat2('');
		setGrat3('');
		setRefresh(refresh+1);
	};

	return (
		<PlanlyScreen>
			<PlanlyScroll padded={true}>

				<VisionBoard />

				<PlanlyView style={styles.dateRow}>
					{ds==='intl'?
						<PlanlyTextInput placeholder={dateView.day[lang]} autoCapitalize='none' value={day} onChangeText={setDay} onEndEditing={saveDay} style={styles.dateInput} />
						:<PlanlyTextInput placeholder={dateView.month[lang]} autoCapitalize='none' value={month} onChangeText={setMonth} onEndEditing={saveMonth} style={styles.dateInput} />
					}
					{ds!=='intl'?
						<PlanlyTextInput placeholder={dateView.day[lang]} autoCapitalize='none' value={day} onChangeText={setDay} onEndEditing={saveDay} style={styles.dateInput} />
						:<PlanlyTextInput placeholder={dateView.month[lang]} autoCapitalize='none' value={month} onChangeText={setMonth} onEndEditing={saveMonth} style={styles.dateInput} />
					}
					<PlanlyTextInput placeholder={dateView.year[lang]} autoCapitalize='none' value={year} onChangeText={setYear} onEndEditing={saveYear} style={styles.dateInput} />
					<DropDown items={getWeekDays(ws,lang)} action={saveWeekDay} width={125} initial={current.date.weekday===-1?'':current.date.weekday} label={dateView.weekDay[lang]} refresh={refresh} />
				</PlanlyView>

				<PlanlyView style={styles.itemBlock}>
					<LabelText>{gratsLabel[lang]}</LabelText>
					<PlanlyView style={styles.gratRow}>
						<BodyText>1.</BodyText>
						<PlanlyTextInput value={grat1} onChangeText={setGrat1} onEndEditing={()=>saveGratitude(0)} style={styles.gratInput} />
					</PlanlyView>
					<PlanlyView style={styles.gratRow}>
						<BodyText>2.</BodyText>
						<PlanlyTextInput value={grat2} onChangeText={setGrat2} onEndEditing={()=>saveGratitude(1)} style={styles.gratInput} />
					</PlanlyView>
					<PlanlyView style={styles.gratRow}>
						<BodyText>3.</BodyText>
						<PlanlyTextInput value={grat3} onChangeText={setGrat3} onEndEditing={()=>saveGratitude(2)} style={styles.gratInput} />
					</PlanlyView>
				</PlanlyView>

				<PlanlyView style={styles.itemBlock}>
					<LabelText>{tasksLabel[lang]}</LabelText>
					<PlanlyView style={styles.tasksBlock}>
						{tasks.length===0?
							<BodyText>{noTasks[lang]}</BodyText>
						:null}
						{!loaded?null:
							tasks.map(task=><TaskItem task={task} picker={false} plan={true} onDel={removeTask} onEdit={()=>setCurT(task.id)} items={data.categories.items()} onFlip={()=>setCurT(task.id)} key={task.id} />)
						}
					</PlanlyView>
					<IconTextButton icon='plus' label={addTaskButton[lang]} action={()=>setPicker(true)} style={styles.addTaskButton} />
				</PlanlyView>

			</PlanlyScroll>
			<HoverButton icon='check' action={()=>setWarn(true)} />
			<PlanlyModal show={warn} setShow={setWarn}>
				<Warning message={archiveWarning.msg[lang]} labels={archiveWarning.labels[lang]} actions={[()=>setWarn(false),archive]}/>
			</PlanlyModal>
			<PlanlyModal show={picker} setShow={setPicker} height='90%'>
				<Picker cats={data.categories} onPick={pickTask} onAddPick={pickAddedTask} picks={current.tasks} back={()=>setPicker(false)} />
			</PlanlyModal>
		</PlanlyScreen>
	);
}

const styles = StyleSheet.create({
	dateRow: {
		display: 'flex',
		flexDirection: 'row',
		gap: 16,
		alignItems: 'center',
		justifyContent: 'center',
		padding: 16,
	},
	dateInput: {
		textAlign: 'center',
		display: 'flex',
		flexGrow: 1,
		flexShrink: 1,
		alignContent: 'stretch',
	},
	itemBlock: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'stretch',
		gap: 16,
		padding: 16,
	},
	gratRow: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		gap: 16,
	},
	gratInput: {
		display: 'flex',
		flexGrow: 1,
		flexShrink: 1,
		alignContent: 'stretch',
	},
	tasksBlock: {
		paddingVertical: 16,
	},
	addTaskButton: {
		alignSelf: 'flex-start',
	}
});