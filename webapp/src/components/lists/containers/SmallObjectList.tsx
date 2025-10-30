import {Component, createRef, RefObject} from "react";
import {Listable} from "../../../services/models/interfaces/Listable.ts";
import {SmallObjectListEntry} from "../entries/SmallObjectListEntry.tsx";
import "./styles/SharedList.css"
import "./styles/SmallObjectList.css"

export class SmallObjectList extends Component<{
    items: Listable[],
    onInteract?: Function,
    onHoverEnter?: Function,
    onHoverExit?: Function,
    selectedId?: string
}> {
    private readonly list: RefObject<HTMLDivElement>;

    constructor(props) {
        super(props);
        this.list = createRef();
    }

    componentDidUpdate(prevProps: Readonly<{
        items: Listable[];
        onInteract?: Function;
        onHoverEnter?: Function;
        onHoverExit?: Function;
        selectedId?: string
    }>, _prevState: Readonly<{}>, _snapshot?: any) {
        if(this.props.selectedId && prevProps.selectedId !== this.props.selectedId) {
            const index = this.props.items.findIndex((v) => v.getId() === this.props.selectedId);
            this.list.current?.children.item(index)?.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
                inline: "start"
            })
        }
    }

    render() {
        return (
            <>
                <div className={"resize listContainer offset"}>
                    <div ref={this.list} className={"offset scrollable"}>
                        {this.props.items.map((item, index) => (
                            <SmallObjectListEntry key={index}
                                                  item={item}
                                                  selected={this.props.selectedId === item.getId()}
                                                  onInteract={this.props.onInteract}
                                                  onHoverEnter={this.props.onHoverEnter}
                                                  onHoverExit={this.props.onHoverExit}
                            />
                        ))}
                    </div>
                </div>
            </>
        );
    }
}