import { get } from "@visactor/vtable/es/themes";
import { config, env, api } from "mdye";
import * as VTableGantt from "@visactor/vtable-gantt";
var _ = require('lodash');

class Mdyeapi {
    constructor(parameters) {
        this.parameters = parameters;
        this.config = config;
        this.env = env;
        this.api = api;
    }
    getConfig() {
        return this.config;
    }
    getEnv() {
        return
    }
    getApi() {
        return this.api;
    }
    async getRecords() {
        console.log('config=', this.config);
        console.log('env=', this.env);
        console.log('api=', this.api);
        const records = []
        const group = []
        const controls = this.config.controls
        // 获取分组条件
        for (const group_id of this.env.group) {
            const control_data = _.find(controls, (control) => {
                return control.controlId === group_id
            })
            switch (control_data.type) {
                case 11: {
                    group.push(control_data.options)
                    break;
                }
                case 29: {
                    const relationControls = control_data.relationControls
                    const sourceTitleControlId = control_data.sourceTitleControlId
                    const sourceTitleControl = _.find(relationControls, (relationControl) => {
                        return relationControl.controlId === sourceTitleControlId
                    })
                    console.log('sourceTitleControl=', sourceTitleControl);
                    const count = await this.api.getRowRelationRows({
                        controlId: control_data.controlId
                    })
                    console.log('count=', count);

                    break;
                }
                default:
                    break;
            }
        }


        return records
    }
    getTasksShowMode() {
        if (!this.env.showType) {
            return VTableGantt.TYPES.TasksShowMode.Tasks_Separate
        }
        const type = {
            '0': 'Tasks_Separate',
            '1': 'Sub_Tasks_Inline',
            '2': 'Sub_Tasks_Separate',
            '3': 'Sub_Tasks_Arrange',
            '4': 'Sub_Tasks_Compact'
        }
        return VTableGantt.TYPES.TasksShowMode[type[this.env.showType]]
    }
}

const mdyeapi = new Mdyeapi()
export { mdyeapi };