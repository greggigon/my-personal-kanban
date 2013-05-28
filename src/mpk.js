var mpk = mpk || {
    isNullOrUndefined : function(thing) {
        return ((typeof thing == "undefined") || (thing == null));
    }
};

mpk.Columns = function(doc, numberOfColumnsFieldId, confirmButtonId, columnsContentId, menu) {
    this.MINIMUM_NUMBER_OF_COLUMNS = 2;
    this.MAXIMUM_NUMBER_OF_COLUMNS = 12;
    this.numberOfColumns = 0;
    this.numberOfColumnsField = doc.getElementById(numberOfColumnsFieldId);
    this.confirmButton = doc.getElementById(confirmButtonId);
    this.columnsContent = doc.getElementById(columnsContentId);

    this.menu = doc.getElementById(menu);
    this.menuContent = doc.getElementById("menuContent");

    this.initiliseColumns();
    return this;
};

mpk.Columns.prototype = {

    initiliseColumns: function() {
        var self = this;
        this.confirmButton.onclick = function() {
            self.initColumnsForFirstTime();
            return false;
        };
    },

    initColumnsForFirstTime: function() {
        var numberOfColumns = this.getNumberOfColumns();

        if (numberOfColumns < this.MINIMUM_NUMBER_OF_COLUMNS || numberOfColumns > this.MAXIMUM_NUMBER_OF_COLUMNS) {
            this.numberOfColumnsField.classList.add("error");
            this.numberOfColumnsField.setAttribute("title", "Minimum number of columns is 2 and maximum is 9")
            return;
        }
        this.numberOfColumns = numberOfColumns;

        for (var i = 0; i < numberOfColumns; i++) {
            var element = this.createColumnElement(i, "Column name", numberOfColumns);
            mpk.DM.add(this.columnsContent, element);
        }

        this.confirmButton.onclick = null;
    },

    updateColumnSize : function() {
        var columns = $('.column');
        var maxHeight = Math.max.apply(Math, columns.map(function(){ return $(this).height();}).get());
        columns.height(maxHeight);
    },


    createColumnElement : function(columnNumber, columnTitle, totalColumns) {
        var columnId = "column" + columnNumber;
        var column = document.getElementById('column-template').children[0].cloneNode(true);
        column.setAttribute("id", columnId);
        column.setAttribute("data-columnNumber", columnNumber);
        $(column).addClass('span' + 12 / totalColumns)

        var header = column.getElementsByClassName('columnName')[0];
        header.innerHTML = columnTitle;

        var addButton = column.getElementsByClassName('addCard')[0];

        var self = this;

        addButton.onclick = function() {
            var cardTitle = prompt("what?");
            self.addCardToColumn(column, cardTitle);
            return false;
        };

        return column;
    },

    addCardToColumn : function(column, cardTitle) {
        if (mpk.isNullOrUndefined(cardTitle) || (cardTitle == "")) {
            return;
        }
        //TODO: hardcoded the template ID for the time, change it
        var card = document.getElementById('card-template').children[0].cloneNode(true);
        var title = card.getElementsByClassName('title')[0];
        title.innerHTML = cardTitle;

        mpk.DM.add(card,  title);

        this.setupRemoveButton(column, card);
        this.addMoveButtons(column, card);

        mpk.DM.add(column, card);
    },

    setupRemoveButton : function(column, card) {
        var self = this;
        var removeButton = card.getElementsByClassName('remove')[0];
        removeButton.onclick = function() {
            if (confirm("Really ???")) {
                self.removeCard(card);
            }
            return false;
        };
    },

    addMoveButtons: function(column, card) {
        var columnPosition = parseInt(column.getAttribute("data-columnNumber"));
        if (columnPosition != 0) {
            this.addMoveLeftButton(column, card);
        }
        if ((columnPosition + 1) != this.numberOfColumns) {
            this.addMoveRightButton(column, card);
        }
    },

    reAddMoveButtons : function(column, card) {
        this.removeMoveButtons(card);
        this.addMoveButtons(column, card);
    },

    removeMoveButtons : function(card) {
        var cardButtons = card.getElementsByClassName('cardButtons')[0];
        var button = cardButtons.getElementsByClassName('moveLeft')[0];

        if (button){
            button.onclick = null;
            cardButtons.removeChild(button);
        }
        button = cardButtons.getElementsByClassName('moveRight')[0];
        if (button){
            button.onclick = null;
            cardButtons.removeChild(button);
        }
    },

    addMoveLeftButton : function(column, card) {
        var moveLeft = document.getElementById('button-move-left').children[0].cloneNode(true);
        var self = this;

        moveLeft.onclick = function() {
            self.moveCardLeft(card, column);
            return false;
        };
        mpk.DM.add(card.getElementsByClassName('cardButtons')[0], moveLeft);
    },

    addMoveRightButton : function(column, card) {
        var moveRight = document.getElementById('button-move-right').children[0].cloneNode(true);
        var self = this;

        moveRight.onclick = function() {
            self.moveCardRight(card, column);
            return false;
        };
        mpk.DM.add(card.getElementsByClassName('cardButtons')[0], moveRight);
    },

    moveCardRight : function(card, column) {
        var nextPosition = parseInt(column.getAttribute("data-columnNumber")) + 1;
        this.moveCardToColumn(card, nextPosition);
    },

    moveCardLeft : function(card, column) {
        var nextPosition = parseInt(column.getAttribute("data-columnNumber")) - 1;
        this.moveCardToColumn(card, nextPosition);
    },

    moveCardToColumn : function(card, columnNumber) {
        var newColumn = document.getElementById("column" + columnNumber);
        card.parentNode.removeChild(card);

        this.reAddMoveButtons(newColumn, card);
        mpk.DM.add(newColumn, card);
    },

    removeCard : function(card) {
        card.parentNode.removeChild(card);
    },

    getNumberOfColumns : function() {
        if (this.numberOfColumnsField.value == "") return 0;
        return parseInt(this.numberOfColumnsField.value);
    },

    getCardsIn :function(column) {
        var cards = [];
        for (var i = 0; i < column.children.length; i++) {
            if (column.children[i].hasAttribute("class") && column.children[i].getAttribute("class").toUpperCase() == "CARD") {
                cards.push(column.children[i]);
            }
        }
        return cards;
    }

};

mpk.Menu = function(columns, menuSelector) {
    this.columns = columns;
//    this.initiliseColumns();
    return this;
};

mpk.Menu.prototype = {
    initiliseColumns : function() {
        this.attachActionToAddColumnAtTheEndButton();
        this.attachActionToAddColumnAtAnyPosition();
        this.attachSave();
    },

    attachActionToAddColumnAtTheEndButton : function() {
        var self = this;
        var handle = function() {
            var columnTitle = prompt("What name should it have?");
            if (!mpk.isNullOrUndefined(columnTitle)) {
                self.columns.appendColumnAtEnd(columnTitle);
            }
            return false;
        }
        document.getElementById("addColumnAtTheEnd").onclick = handle;
    },

    attachActionToAddColumnAtAnyPosition : function() {
        var self = this;
        var handle = function() {
            var columnTitle = prompt("What name should it have?");
            if (!mpk.isNullOrUndefined(columnTitle)) {
                var position = parseInt(document.getElementById("newColumnPosition").value);
                self.columns.addColumnAtPosition(columnTitle, position);
            }
            return false;
        };
        document.getElementById("addColumnAtPosition").onclick = handle;
    },

    attachSave : function(){
        var handle = function() {
            var kanban = document.getElementById("kanban");
            var serialized = new mpk.Serializer(document.getElementById("kanbanName").innerHTML).serialize(kanban);
            localStorage.setItem("mpk", serialized);
            return false;
        };
        document.getElementById("saveKanban").onclick = handle;
    }
};

mpk.DM = {
    add : function(where, what) {
        where.appendChild(what);
    },

    addBefore : function(where, what) {
        where.parentNode.insertBefore(what, where);
    },

    removeAllElementsFrom : function(whereFrom) {
        if (whereFrom.hasChildNodes()) {
            while (whereFrom.childNodes.length >= 1) {
                whereFrom.removeChild(whereFrom.firstChild);
            }
        }
    }
};

mpk.Serializer = function(kanbanName) {
    this.kanbanName = kanbanName;
    return this;
};

mpk.Serializer.prototype = {

    serialize : function(kanban) {
        var serialized = {};
        serialized.name = this.kanbanName;
        var columns = kanban.getElementsByClassName("column");
        serialized.numberOfColumns = columns.length;
        serialized.columns = [];
        for (var i = 0; i < serialized.numberOfColumns; i++) {
            serialized.columns.push(this.serializeColumn(columns[i]));
        }
        return JSON.stringify(serialized);
    },

    serializeColumn : function(column) {
        var serializedColumn = {};
        serializedColumn.name = column.getElementsByTagName("h3")[0].innerHTML;
        var cards = column.getElementsByClassName("card");
        serializedColumn.numberOfCards = cards.length;
        serializedColumn.cards = [];
        for(var i=0;i<serializedColumn.numberOfCards;i++){
           serializedColumn.cards.push(this.serializeCard(cards[i]));
        }
        return serializedColumn;
    },

    serializeCard : function(card){
        var serializedCard = {};
        serializedCard.title = card.getElementsByTagName("span")[0].innerHTML;
        return serializedCard;
    }
};

mpk.Deserializer = function(mpkColumns){
    this.columns = mpkColumns;
    return this;
};

mpk.Deserializer.prototype = {
    deserialize : function(serializedKanban, whereTo){
        var kanbanObject = JSON.parse(serializedKanban);
        for(var i=0;i<kanbanObject.numberOfColumns;i++){
            this.deserializeColumn(kanbanObject.columns[i], whereTo, i, kanbanObject.numberOfColumns);
        }
        this.columns.numberOfColumns = kanbanObject.numberOfColumns;
        this.columns.updateColumnSize();
        return kanbanObject.name;
    },

    deserializeColumn : function(column, where, position, allColumns){
        var newColumn = this.columns.addColumn(column.name, position, mpk.DM.add, where, allColumns);
        for(var i=0;i<column.numberOfCards;i++){
            this.deserializeCard(newColumn, column.cards[i]);
        }
    },

    deserializeCard : function(column, card){
        this.columns.addCardToColumn(column, card.title);
    }
};
