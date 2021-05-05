/**
 * Interface that represents a note manager
 * @function add Allows to add a new note to the user's folder
 * @function remove Allows to delete a note from the user's folder
 * @function modify Allows to modify a note from the user's folder
 * @function list Lists all note titles from the user's folder
 * @function read Reads a specific note from the user's folder
 */
export interface intManager {
    add(title: string, body: string, color: string, user: string): void;
    remove(user: string, title: string): void;
    modify(user: string, title: string, newTitle: string, newBody: string, newColor: string): void;
    list(user: string): string[];
    read(user: string, title: string): void;
}