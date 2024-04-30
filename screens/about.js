import { PlanlyScreen, PlanlyScroll } from "../components/basics";
import { IconTextButton } from "../components/buttons";


export default function About({setTour}){
    return (
        <PlanlyScreen>
            <PlanlyScroll></PlanlyScroll>
            <IconTextButton icon='play-bold' label='tap this' action={()=>setTour(true)} />
        </PlanlyScreen>
    );
}