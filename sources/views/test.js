import {JetView} from "webix-jet";
import {wordsGroup} from "models/wordsGroup";


export default class doTest extends JetView {
    config() {
        this.groupName = "";

        return {
            rows: [
                    {
                        view: "label",
                        label: "Please choose the group of words:"
                    },
                    {cols: [
                        {
                            view: "richselect",
                            localId: "myrichselect",
                            options: {body:{template:"#name#", data: wordsGroup} },
                            width: 200,
                            on: {
                                "onChange": () => {
                                    this.groupName = this.$$("myrichselect").getText();
                                    this.getRandomWordLabel();
                                }
                            }
                        },
                        {view: "spacer"},
                    ]
                },
                {
                    cols: [
                        {view: "label",label: "",align: "center",localId: "mylabel"}
                    ]
                },
                
                {
                    margin:30,cols: [
                        { view:"spacer"},
                        { view: "button",localId:"1",value: "",width: 200},
                        { view: "button",localId:"2",value: "",width: 200},
                        { view: "spacer"}
                    ]
                },

                {
                    margin: 30,cols: [
                        { view:"spacer"},
                        { view: "button",localId:"3",value: "",width: 200},
                        { view: "button",localId:"4",value: "",width: 200},
                        { view: "spacer"}
                    ]
                },
                {view: "spacer"}

            ]
           
        }   
        
    }


    getRandomWordLabel() {
    
    this.allButtonValueClear();

    let obj = wordsGroup.find((obj) => {
        return obj.name === this.groupName;
      },true)

    let buttonIds = ["1", "2", "3", "4"];
    let buttonIndex = this.getRandomArbitrary(0, buttonIds.length-1);
    
    let randomButton = buttonIds[buttonIndex];
    buttonIds.splice(buttonIndex,1);

        if(Array.isArray(obj.wordsIds) && typeof(obj.wordsIds) === "object") {
            let random = this.getRandomArbitrary(0,obj.wordsIds.length);
            let randomWord = obj.wordsIds[random].originWords;
            this.$$("mylabel").setValue(randomWord);
            let randomTranslateWord = obj.wordsIds[random].translation;
            this.$$(randomButton).setValue(randomTranslateWord);
        } else {
            this.$$("mylabel").setValue(obj.wordsIds.originWords);
            this.$$(randomButton).setValue(obj.wordsIds.translation);
        }
    }

    getRandomArbitrary(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }

    allButtonValueClear() {
        this.$$("1").setValue("");
        this.$$("2").setValue("");
        this.$$("3").setValue("");
        this.$$("4").setValue("");
    }

    init() {
    
    }
}
