My Personal Kanban (MPK)
==========================

This is a small and simple in-browser application that aspire to be offline Personal Kanban board.

It is a single page JavaScript application with very basic functionality. 

## Download

You can get latest release zip [at this link](https://github.com/greggigon/my-personal-kanban/blob/master/my-personal-kanban-0.7.0.zip?raw=true). Lastest version is 0.7.0 and includes new Cloud upload and download functionality.

## How to use it?

Download the applicaton distribution zip file, unzip it at your prefered location, open __index.html__ page in your browser and your done.

There is no need to be connected to Internet to use it. You can run it in any modern browser. The application will store your data in Web Browser's local storage, so you will not loose it.

### Functionality

The functionality is very simple and basic. For a short screencast demo you can navigate to [Github pages](http://greggigon.github.io/my-personal-kanban/) .

Kanban boards with 2,3,4 and 6 columns, name columns and delete kanban.

You can add cards to columns and drag them between columns as well as remove them.

## Adding Themes

Themes are just a simple CSS files. They should be put in the __styles/themes__ folder. New Theme should be added to __scripts/themes.js__ file. Also, a Theme image (jpg) can be placed in __img/themes__ folder. Name of the image should be the same as the __css__ attribute in the themes.js file.

## A bit of history

I started this little project 2 years ago when I decided to familiarise myself with HTML5, Pure JavaScript and CSS.

I used jQuery with QUnit for JavaScript TDD testing.

I managed to get it to a workable state and stop developing it.

After first public release not too long ago, I decided to rewrite it in __Angular__.

This application is the result of me doing so, while attempting to learn Angular at the same time :)

### Want to help?

If you want to help me with styling or anything else, please do get in touch.

Any issues, raise it on github.
