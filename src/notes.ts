import {intNotes} from "./intNotes";

/**
 * Class that represents a note
 */
export class Notes implements intNotes {
    /**
     * Creates a new note instance
     * @param title Title of the note
     * @param body Body of the note
     * @param color Color of the note
     */
    constructor(public title: string, public body: string, public color: string) {}

    /**
     * Obtains the note title
     * @returns Title of the note
     */
    getTitle() {
        return this.title;
    }

    /**
     * Obtains the note body
     * @returns Body of the note
     */
    getBody() {
        return this.body;
    }

    /**
     * Obtains the note color
     * @returns Color of the note
     */
    getColor() {
        return this.color;
    }

    /**
     * Sets a new title to an existing note
     */
    setTitle(newTitle: string) {
        this.title = newTitle;
    }

    /**
     * Sets a new body to an existing note
     */
    setBody(newBody: string) {
        this.body = newBody;
    }

    /**
     * Sets a new color to an existing note
     */
    setColor(newColor: string) {
        this.color = newColor;
    }

    /**
     * Converts a note attributes into a JSON formatted string
     * @returns A JSON formatted string
     */
    toJSON(): string {
        return '{\n\"title\": \"' + this.title + '\",\n\"body\": \"' + this.body + '\",\n\"color\": \"' + this.color + '\"\n}';
    }
}