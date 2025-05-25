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
        const relatedRecordsGroup = []
        const controls = this.config.controls
        const worksheetId = this.config.worksheetId
        const viewId = this.config.viewId
        const pageSize = 10
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
                    const sourceTitleControlId = control_data.sourceTitleControlId
                    // 获取任务总数
                    const count = await this.api.getFilterRowsTotalNum({
                        worksheetId: worksheetId,
                        viewId: viewId,
                    })
                    //  获取最大页数
                    const page = Math.ceil(count / pageSize)

                    // 获取所有关联表数据的标题进行分组
                    for (let i = 1; i < page; i++) {
                        const { data } = await this.api.getFilterRows({
                            worksheetId: worksheetId,
                            viewId: viewId,
                            pageIndex: i,
                            pageSize: pageSize,
                            notGetTotal: true,
                        })
                        for (const item of data) {
                            const relatedRecords = item[control_data.controlId]
                            const relatedRecordsJson = JSON.parse(relatedRecords)
                            if (relatedRecordsJson && relatedRecordsJson.length > 0) {
                                const sourcevalue = JSON.parse(relatedRecordsJson[0].sourcevalue)
                                const title = sourcevalue[sourceTitleControlId]
                                relatedRecordsGroup.push(title)
                            }
                        }
                    }
                    const options = new Set(relatedRecordsGroup)
                    const optionsArray = Array.from(options)
                    group.push(optionsArray)
                    break;
                }
                default:
                    break;
            }
            console.log('group=', group);
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