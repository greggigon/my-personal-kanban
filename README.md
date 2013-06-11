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

You can Click on Column headers to rename them.

Plus sign in the top right corner can be used to add new Card to a column.

Card could be Moved between columns with arrow buttons or removed with a Cross button.

### Menu

There should be a Menu in the Top right corner.

You can persist your Kanban to a storage of your browser. When the page is opened next time it will automatically load Kanban content from local storage.

You can Delete the Kanban from local storage. The Kanban board will stay as it was however next time you open the browser you will meet empty page with prompt for number of columns.

You can also Start new Kanban board, which will remove the old one from local storage and start from scratch.

### Multiple Kanban boards

Well, I need to do this work.

## More about technology

### First a bit of a history

I started this little project 2 years ago when I decided to familiarise myself with HTML5, Pure JavaScript and CSS.

I used jQuery with QUnit for JavaScript TDD testing.

I managed to get it to a workable state and stop developing it.

### How things are now?

At some point I decided that I want to use it for my personal stuff. I like Kanban and I use it as a kind of a more sophisticated TODO list.

It wasn't entirely working like I wanted it to so I decided to fix it and style it quickly.

I slapped Twitter Bootstrap on it with jQuery leaking into non-test code.

For testing and Browser automation I use Geb to lunch browser and run all the QUnit test.

Build script is driven by Gradle.


