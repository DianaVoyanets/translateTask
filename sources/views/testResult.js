import {JetView} from "webix-jet";
import {testResultsCollection} from "models/testResult";

export default class testResult extends JetView {
	config() {
		const _ = this.app.getService("locale")._;
		return {
			view: "datatable",
			localId: "mydatatable",
			columns: [
				{id: "result",header: _("Result"),width: 100},
				{id: "groupName",header: _("Group name"),width: 250},
				{id: "createdAt",header: _("CreatedAt"),width: 250},
			]
		};
	}
	init() {
		this.getRoot().sync(testResultsCollection);
	}
} 