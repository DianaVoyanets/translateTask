import {JetView} from "webix-jet";
import {testResultsCollection} from "models/testResult";

export default class testResult extends JetView {
    config() {
        return {
            view: "datatable",
            localId: "mydatatable",
            columns: [
                {id: "result",header: "Result",width: 100},
                {id: "groupName"},
                {id: "createdAt",width: 250},
            ]
        }
    }
    init() {
        this.$$("mydatatable").sync(testResultsCollection);
    }
} 