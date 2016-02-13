// Brunch automatically concatenates all files in your
// watched paths. Those paths can be configured at
// config.paths.watched in "brunch-config.js".
//
// However, those files will only be executed if
// explicitly imported. The only exception are files
// in vendor, which are never wrapped in imports and
// therefore are always executed.

// Import dependencies
//
// If you no longer want to use a dependency, remember
// to also remove its path from "config.paths.watched".
import "phoenix_html"
import React from "react";
import ReactDOM from "react-dom";
import Step1 from "./wizard/step1"

//import mobservable from "bower_components/mobservable/dist/mobservable"

let store = mobservable.observable({
  boxes: [],
  arrows: [],
  selection: null,
})

store.addBox = function(box){
  box = mobservable.observable(box)
  this.boxes.push(box);
}
store.addBox(2)



let Step2 = mobservableReact.observer(React.createClass({
  render: function() {
    return (
      <div>
        <h1>Hello, world! Been waiting for you.</h1>
        <div onClick={this.onClick}>
          +
        </div>

        <div>
          {this.props.store.boxes.length}
        </div>
      </div>
    );
  },

  onClick: function(){
    console.log("clicked")
    console.log(this.props.store)
    this.props.store.addBox(1);
  }
}))


ReactDOM.render(
  <Step2 store={store} />,
  document.getElementById("react-container")
);

