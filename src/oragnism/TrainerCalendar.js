import React, { Component } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import events from "atom/events";
import ExampleControlSlot from "atom/ExampleControlSlot";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.scss";

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

class TrainerCalendar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            events: events,
            displayDragItemInCell: true,
        };

        this.moveEvent = this.moveEvent.bind(this);
        this.newEvent = this.newEvent.bind(this);
    }

    handleDragStart = (event) => {
        this.setState({ draggedEvent: event });
    };

    dragFromOutsideItem = () => {
        return this.state.draggedEvent;
    };

    onDropFromOutside = ({ start, end, allDay }) => {
        const { draggedEvent } = this.state;

        const event = {
            id: draggedEvent.id,
            title: draggedEvent.title,
            start,
            end,
            allDay: allDay,
        };

        this.setState({ draggedEvent: null });
        this.moveEvent({ event, start, end });
    };

    moveEvent = ({ event, start, end, isAllDay: droppedOnAllDaySlot }) => {
        const { events } = this.state;

        let allDay = event.allDay;

        if (!event.allDay && droppedOnAllDaySlot) {
            allDay = true;
        } else if (event.allDay && !droppedOnAllDaySlot) {
            allDay = false;
        }

        const nextEvents = events.map((existingEvent) => {
            return existingEvent.id == event.id ? { ...existingEvent, start, end } : existingEvent;
        });

        this.setState({
            events: nextEvents,
        });

        // alert(`${event.title} was dropped onto ${updatedEvent.start}`)
    };

    resizeEvent = ({ event, start, end }) => {
        const { events } = this.state;

        const nextEvents = events.map((existingEvent) => {
            return existingEvent.id == event.id ? { ...existingEvent, start, end } : existingEvent;
        });

        this.setState({
            events: nextEvents,
        });

        //alert(`${event.title} was resized to ${start}-${end}`)
    };

    newEvent(event) {
        // let idList = this.state.events.map(a => a.id)
        // let newId = Math.max(...idList) + 1
        // let hour = {
        //   id: newId,
        //   title: 'New Event',
        //   allDay: event.slots.length == 1,
        //   start: event.start,
        //   end: event.end,
        // }
        // this.setState({
        //   events: this.state.events.concat([hour]),
        // })
    }

    handleSelect = ({ start, end }) => {
        const title = window.prompt("New Event name");
        if (title)
            this.setState({
                events: [
                    ...this.state.events,
                    {
                        start,
                        end,
                        title,
                    },
                ],
            });
    };

    render() {
        return (
            <div className="App">
                <ExampleControlSlot.Entry waitForOutlet>
                    <strong>
                        Click an event to see more info, or drag the mouse over the calendar to select a date/time
                        range.
                    </strong>
                </ExampleControlSlot.Entry>
                <DnDCalendar
                    popup
                    defaultDate={moment().toDate()}
                    defaultView="month"
                    events={this.state.events}
                    localizer={localizer}
                    onEventDrop={this.onEventDrop}
                    onEventResize={this.onEventResize}
                    resizable
                    style={{ height: "100vh" }}
                    selectable
                    localizer={localizer}
                    onSelectEvent={(event) => alert(event.title)}
                    onSelectSlot={this.handleSelect}
                    onEventDrop={this.moveEvent}
                    resizable
                    onEventResize={this.resizeEvent}
                    onDragStart={console.log}
                    dragFromOutsideItem={this.state.displayDragItemInCell ? this.dragFromOutsideItem : null}
                    onDropFromOutside={this.onDropFromOutside}
                    handleDragStart={this.handleDragStart}
                />
            </div>
        );
    }
}

export default TrainerCalendar;
