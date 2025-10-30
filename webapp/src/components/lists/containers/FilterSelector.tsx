import {Component} from "react";
import {FilterEntry} from "../entries/FilterEntry.tsx";
import "./styles/SharedList.css";
import "./styles/FilterSelector.css";
import {BuildingTheme} from "../../../services/helpers/filters/BuildingTheme.ts";

export class FilterSelector extends Component<{filtersTheme : BuildingTheme[], filterChange : Function}> {

    render() {
        return (
            <>
                <div className={"filterSize listContainer scrollable"}>
                {this.props.filtersTheme.map((bt) => (
                    <FilterEntry key={bt.letter} filter={bt} onChange={this.props.filterChange} />
                ))}
                </div>
            </>
        );
    }
}