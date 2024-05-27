import { StyleSheet } from "react-native";

import { PlanlyScroll, PlanlyView } from "./basics";
import { CategoryItem } from "./category";
import { TapButton } from "./buttons";


export function Picker({cats, onPick, onAddPick,picks,back}){

	const addTask = async (...args)=>{
		onAddPick(await cats.addTask(...args));
	};

	return (
		<PlanlyView style={styles.container}>
			<PlanlyScroll>
				{Object.values(cats.categories).flat().map(category=><CategoryItem cat={category} picker={true} onPick={onPick} picks={picks} onAddTask={addTask} items={cats.items()} key={category.id} />)}
			</PlanlyScroll>
			<TapButton icon='down' action={back} style={styles.backButton} />
		</PlanlyView>
	);
}

const styles = StyleSheet.create({
	container: {
		height: '100%',
		width: '100%',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'flex-start',
		alignItems: 'stretch',
	},
	backButton: {
		display: 'flex',
		alignSelf: 'center',
	},
});