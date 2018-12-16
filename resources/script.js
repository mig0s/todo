/*
 *
 * COMPONENTS
 *
 */

// COMMON ELEMENT CLASS
class ToDoElement extends HTMLElement {
    constructor() {
        // CALL PARENT CONSTRUCTOR (HTMLElement)
        super();

        // INITIATE SHADOW ROOT AND ADD STYLES
        this.root = this.attachShadow({ mode: "open" });
        this.root.innerHTML = `
        <style>
        .cell {
            padding: 5px;
            background-color: whitesmoke;
            border: grey solid 1px;
            border-radius: 5px;
        }
        /* BUTTONS STYLES */
        .btn {			
            border: 1px solid lightgray;
            background-color: darkgreen;
            color: white;
            border-radius: 5px;
            margin-top: 5px;
            padding: 5px;
            cursor: pointer;
            transition: 0.25s;
            font-size: 12px;
            text-shadow: #000 0 1px;
            font-weight: 800;
        }
        .btn:hover {
            background-color: black;
        }
        .btn:active {
            background-color: grey;
            text-shadow: dimgray 0 2px;
        }
        .delCol {
            float: right;
            background-color: darkred;
        }
        </style>`;
    }
}

// COLUMN CLASS
class ToDoColumn extends ToDoElement {
    constructor() {
        super();
    }
    set Column(Column) {
        this.root.innerHTML += `
        <style>
            .column {
                position: relative;
                padding-top: 10px;
                padding-bottom: 5px;
                min-height: 50px;
                background-color: #bebebe;
                border-radius: 5px;
            }
            .columnHeader {
                padding: 5px 0;
                font-size: 24px;
                cursor: pointer;
            }
        </style>
        <div class="cell">
            <div class="columnHeader" contenteditable="true">${Column.title}</div>		
            <div class="column" id="${Column.id}">
                <span></span>			
            </div>
            <button class="btn addCard" id="newCard"><b>+</b> new card</button>
            <button class="btn delCol"><b>x</b> delete column</button>
        </div>`;
    }
    connectedCallback() {
        console.log('ToDoColumn connected');
        let self = this;

        // DELETE COLUMN EVENT LISTENER -> DELETES COLUMN ON CLICK
        let delColBtnElem = this.root.querySelector('.delCol');
        delColBtnElem.addEventListener('click', function(ev) {
            let columnId = self.root.querySelector('.column').id;
            deleteColumn(columnId);
            self.remove();
        });

        // TITLE EDITING EVENT LISTENER -> UPDATES COLUMN ON INPUT
        let titleElem = this.root.querySelector('.columnHeader');
        titleElem.addEventListener('input', function(ev) {
            let columnId = self.root.querySelector('.column').id;
            let title = self.root.querySelector('.columnHeader').textContent;
            var Column = {
                id: columnId,
                title: title
            };
            updateColumn(Column);
        });

        // CARD ADDING EVENT LISTENER -> ADDS A CARD WITH RANDOM ID & DEFAULT TITLE AND DESCRIPTION
        let addCardBtnElem = this.root.querySelector('.addCard');
		addCardBtnElem.addEventListener('click', function(ev) {
            
            var cardContainer = self.root.querySelector('.column');
            var childCard = document.createElement('todo-card');
            var Card = {
                id: Math.floor((Math.random() * 10000) + 1),
                title: 'new card',
                description: 'description',
                columnId: self.root.querySelector('.column').id
            };
            childCard.Card = Card;
            cardContainer.appendChild(childCard);
            addCard(Card);
        });
    }
}

// CARD CLASS
class ToDoCard extends ToDoElement {
    constructor() {
        super();
    }
    set Card(Card) {
        this.root.innerHTML += `
        <style>		
        .card {
            position: relative;
            height: 100%;
            margin: 0px 5px 5px 5px;
            background-color: #ffffff;
            border-radius: 5px;
            cursor: pointer;
        }	
        .card .title {
            padding: 5px;
            color: black;
            background-color: #ececec;
            border-top-left-radius: 5px;
            border-top-right-radius: 5px;
            font-size: 1em;
            font-weight: 600;
        }
        .card .description {
            margin: 0 0 5px 0;
            padding: 5px;
            font-size: 0.8em;
            color: black;
        }		
        .card .deleteBtn {
            float: right;
            font-size: 1em;
            color: darkred;
            font-weight: 600;
        }
        </style>
        <div class="card" id="${Card.id}">
            <div class="deleteBtn">x&nbsp;&nbsp;</div>
            <div class="title" contenteditable="true">
                ${Card.title}			
            </div>			
            <div class="description" contenteditable="true">
                ${Card.description}
            </div>
        </div>`;
    }
    connectedCallback() {
        console.log('ToDoCard connected');
        let self = this;

        // DELETE CARD EVENT LISTENER -> DELETES CARD ON CLICK
        let delCardBtnElem = this.root.querySelector('.deleteBtn');
		delCardBtnElem.addEventListener('click', function(ev) {
            var cardId = self.root.querySelector('.card').id;
            self.remove();
            deleteCard(cardId);
        });

        // CARD TITlE EDITING EVENT LISTENER
        let titleElem = this.root.querySelector('.title');
        titleElem.addEventListener('input', function(ev) {
            let cardId = self.root.querySelector('.card').id;
            let title = self.root.querySelector('.title').textContent;
            var Card = {
                id: cardId,
                title: title
            };
            updateCard(Card);
        });

        // CARD DESCRIPTION EDITING EVENT LISTENER
        let descriptionElem = this.root.querySelector('.description');
        descriptionElem.addEventListener('input', function(ev) {
            let cardId = self.root.querySelector('.card').id;
            let description = self.root.querySelector('.description').textContent;
            var Card = {
                id: cardId,
                description: description
            };
            updateCard(Card);
        });
    }
}

customElements.define('todo-column', ToDoColumn);
customElements.define('todo-card', ToDoCard);

/*
 *
 * FUNCTIONS
 *
 */


const serverUrl = `http://localhost:3000/`;

function addCard (Card) {

    // ADD CARD USING 'POST' REQUEST
    let options = {
        method: 'POST', 
        body: JSON.stringify(Card),
        headers:{ 'Content-Type': 'application/json' }
    };	
    jsonRequest( `${serverUrl}cards/`, options );
}

function deleteCard(cardId) {

    // DELETE CARD USING 'DELETE' REQUEST
    let options = { method: 'DELETE' };	
    jsonRequest( `${serverUrl}cards/${cardId}`, options );
}

function updateCard(Card) {
    let cardId = Card.id;

    // UPDATE CARD USING 'PATCH' REQUEST   
    let options = {
        method: 'PATCH',
        body: JSON.stringify(Card),
        headers:{
            'Content-Type': 'application/json'
        }
    };	
    jsonRequest( `${serverUrl}cards/${cardId}`, options );
}


function deleteColumn (columnId) {

    // DELETE COLUMN USING 'DELETE' REQUEST
    let options = { method: 'DELETE' };
    jsonRequest( `${serverUrl}columns/${columnId}`, options );

}

function updateColumn (Column) {
    let columnId = Column.id;
    // UPDATE COLUMN USING 'PATCH' REQUEST
    let options = {
        method: 'PATCH',
        body: JSON.stringify(Column),
        headers:{ 'Content-Type': 'application/json' }
    };
    jsonRequest( `${serverUrl}columns/${columnId}`, options );
}

function jsonRequest( url, options = {}) {
    // SEND HTTP REQUEST TO SERVER
    fetch( url, options ).then( function( response ) {
        if ( response.ok ) { return response.json(); }
        throw new Error('Response failed');
    });
}

async function fetchColumns() {
    const res = await fetch(serverUrl + 'columns');
    const json = await res.json();

    // GETTING COLUMNS
    json.forEach(Column => {

        // RENDER COLUMNS
        const columnElement = document.createElement('todo-column');
        columnElement.Column = Column;
        main.appendChild(columnElement);

        // GETTING CARDS FOR EACH COLUMN
        fetch(serverUrl + 'cards?columnId=' + Column.id).then(response => {
            return response.json();
        }).then(data => {
            data.forEach(Card => {

                // RENDER CARDS
                var cardContainer = columnElement.root.getElementById(Column.id);
                var childCard = document.createElement('todo-card');
                childCard.Card = Card;
                cardContainer.appendChild(childCard);
            });
        });
    });
}

function searchCards(searchText) {

    // GET AN ARRAY OF ALL COLUMNS
    let colArr = document.querySelectorAll('todo-column');
    colArr.forEach(colElement => {

        // GET AN ARRAY OF ALL CARDS AND WORK WITH SHADOW ROOT ELEMENTS
        let cardArr = colElement.root.querySelectorAll('todo-card');
        cardArr.forEach(cardElement => {
            let titleElem = cardElement.shadowRoot.querySelector('.title');
            let titleText = titleElem.textContent;

            // REMOVE SPEACIAL CHARACTERS
            titleText = titleText.replace(/(\r\n\t|\n|\r\t)/gm,"");

            // TOGGLE CASE INSENSIVITY
            titleText = titleText.toUpperCase().trim();
            searchText = searchText.toUpperCase().trim();

            // CHECK FOR A MATCH IN THE TITLE
            if (titleText.indexOf(searchText) === -1) {
                cardElement.style.display = 'none';
            } else {
                cardElement.style.display = 'initial';
                cardElement.style.visibility = 'visible';
            }
        });

        // CHECK IF COLUMN STILL CONTAINS VISIBLE CARDS, HIDE COLUMN IF IT DOESN'T
        if (colElement.root.querySelectorAll('todo-card:not([style*="display:none"]):not([style*="display: none"])').length > 0 ) {
            colElement.style.display = 'initial';
            colElement.style.visibility = 'visible';
        } else {
            colElement.style.display = 'none';
        }
    });
}

/*
 *
 * INTIAL SEQUENCES
 *
 */

// FETCHING AND RENDERING ALL ELEMENTS FROM DB
const main = document.getElementById('container');
window.addEventListener('load', () => {
    // CALLING ASYNCHRONOUS FUNCTION fetchColumns TO FETCH AND RENDER ALL ELEMENTS
    fetchColumns();
    // ADD COLUMN EVENT LISTENER
    document.getElementById("addColBtn").addEventListener("click", e => {
        let columnElement = document.createElement("todo-column");
        let Column = {
            id: Math.floor((Math.random() * 10000) + 1),
            title: 'new column'
        };
        columnElement.Column = Column;
        main.appendChild(columnElement);
        let options = {
            method: 'POST', 
            body: JSON.stringify(Column),
            headers:{
                'Content-Type': 'application/json'
            }
        };
        fetch( serverUrl + `columns/`, options );
    })
});

// SEARCH EVENT LISTENER
document.getElementById('searchbar').addEventListener('keyup', function(ev) {
    let searchText = this.value;
    searchCards(searchText);			
});