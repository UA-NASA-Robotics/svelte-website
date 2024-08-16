import {error} from '@sveltejs/kit';
import { json } from '@sveltejs/kit';

const robotData = import.meta.glob('$lib/robots/*.md', {query: '?raw', import: 'default'});


let parsedRobotData: {robotName: string, robotContent: any}[] = [];


async function parseRobotData() {
    if (parseRobotData.length !== 0) { // return the parsed data if it has already been parsed
        return parsedRobotData;
}

    if (Object.keys(robotData).length === 0) { // if there are no robots, return an empty array
        return [];
    }

    for (const [robotPath, robotImporter] of Object.entries(robotData)) { //push all string content of the robots into the parsedRobotData array
        const robotName = robotPath.replace(/\.md$/, '').replace(/^\.\//, '').split('/').pop() ?? 'Undefined';
        const robotContent: any = await robotImporter();

        parsedRobotData.push({ robotName, robotContent: robotContent });
    }

    return parsedRobotData;
        

}



/**@type {import('./$types').PageLoad} */
export async function load({params}) {
    const data = await parseRobotData();

    for( const robot of data) {
        if (robot.robotName === params.name) {
            return {props: {robotContent: robot.robotContent}};
        }
    }

    
    error(404, 'Robot, '+params.name+', does not have an entry yet...');
}