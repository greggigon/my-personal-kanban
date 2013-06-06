My Personal Kanban (MPK)
==========================

This is a small and simple in browser application that aspire to be offline Personal Kanban board.

It is a single page JavaScript application with very basic functionality. No fluff, just basics.

## How to use it?

Open index.html page in your browser and your done.

The application is a single file HTML page with Twitter Bootstrap used for styling and jQuery to help some basic document manipulation.

### Functionality

The functionality is very basic.

You can change Kanban name by clicking top header and edit it inline.

You can choose from a predefined list of column numbers for your Kanban.

One selected you can Click on Column headers to rename them.

Plus sign in the top right corner can be used to add new Card to a column.

Card could be Moved between columns with arrow buttons or removed with a Cross button.

### Menu

Top right corner presents a menu.

You can persist your Kanban to a storage of your browser. When the page is opened next time it will automatically load Kanban content from local storage.

You can Delete the Kanban from local storage. The Kanban board will stay as it was however next time you open the browser you will meet empty page with prompt for number of columns.

You can also Start new Kanban board, which will remove the old one from local storage and start from scratch.

### Multiple Kanban boards

If you want more than one Kanban Board, simply create multiple copies of index.html file.