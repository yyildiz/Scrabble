
/*   Name: Yusuf Yildiz
     Email: GUI I
     Date: December 6, 2016
     Assignment No. 9
     A simple scrabble game that is played using one line.
     */

$(document).ready(function() {
    // init the variable im going to use
    var board = $(".board")
    var tiles = [];
    var countTiles = [];
    var values = {};
    var score = 0;
    // used for calculating the total score
    var multiplier = 1;
    // used for seeing the positions of the dropped tiles
    var droppedTiles = [];
    var tilesLeft = tiles.length;
    // init the beginning of the game.
    updateScore();
    setupTileArrays();
    setupRack();

    // if we submit a word
    $("#submitWord").on("click", function() {
        $(".dropped").remove();
        $("#reset").trigger("click");
        alert("Word has been submitted with a score of " + (score * multiplier));
    })
    $("#reset").on("click", function() {
        // when the reset button is clicked we create new tiles
        var newTiles = getRandomTiles(droppedTiles.length);
        // for each dropped tile get their locaiton
        $(droppedTiles).each(function(i, elem) {
            // creating a new tile
            var tile = $("<div class='rack-tile'>");
            tile.text(newTiles[i]);
            var tileVal = $("<div class='tile-value'>");
            tileVal.text(getValue(newTiles[i]));
            tile.append(tileVal);
            $(".rack").append(tile);
            // removing them from the list
            $(droppedTiles).splice(0, 1)
            // setting the css so that it is positioned correctly.
            tile.css({
                position: 'absolute',
                top: elem.top + 'px',
                left: elem.left + 'px',
                height: '80px'
            })
            // makes the rack tile draggable again
            $(".rack-tile").draggable({
                snap: ".tile",
                cursor: "move",
                appendTo: ".tile",
                snapMode: "inner",
                revert: "invalid",
                grid: [7,1],
                start: function() {
                    var position = $(this).position();
                    droppedTiles.push(position);
                }
            });
        })
        droppedTiles = [];
    });
    // new game needs to be created
    $("#restartGame").on("click", function() {
        restartGame();
    });
    // setup the inital board
    for(var i = 0; i < 7; i++) {
        if(i == 1 || i == 5) {
            var doubleWordTile = $("<div class='tile double-word'>");
            doubleWordTile.text("Double Word Score");
            $(".board").append(doubleWordTile);
        } else {
            $(".board").append("<div class='tile'>")
        }
    }

    // sets up the inital hand
    function setupRack() {
        var currentTiles = getRandomTiles(7);
        $(currentTiles).each(function(i, curr) {
            var tile = $("<div class='rack-tile'>");
            tile.text(curr);
            var tileValue = $("<div class='tile-value'>");
            tileValue.text(getValue(curr));
            tile.append(tileValue);
            $(".rack").append(tile);
        });
        // make it draggable
        $(".rack-tile").draggable({
            snap: ".tile",
            cursor: "move",
            appendTo: ".tile",
            snapMode: "inner",
            revert: "invalid",
            grid: [7,1],
            start: function() {
                var position = $(this).position();
                droppedTiles.push(position);
            }
        });
        // reset the score
        score = 0;
        // set the score
        updateScore();
        updateTilesLeft();
    }
    // creates a totally new game
    function restartGame() {
        setupTileArrays();
        refreshBoard();
    }
    // makes the tile class droppable on.
    $(".tile").droppable({
        accept: ".ui-draggable",
        greedy: true,
        drop: function(e, ui) {
            // get the val and update the score.
            // if it's a double word then increase the multiplier
            var val = parseInt($(ui.draggable).find(".tile-value").text());
            if($(this).hasClass("double-word")) {
                multiplier = multiplier * 2;
            }
            score += val;
            updateScore();
            updateTilesLeft();
            $(ui.draggable).addClass("dropped");
        }
    });
    // finds the score element and updates it.
    function updateScore() {
        $("#score").text("Score : " + (score * multiplier));
    }

    // finds the tiles left element and updates it.
    function updateTilesLeft() {
        tilesLeft = tiles.length;
        $("#tilesLeft").text("Tiles Left : " + tilesLeft);
    }

    // Set up the array with the counts as well as the array that
    // has the amount of characters explicitly.
    function setupTileArrays() {
        tiles = [];
        countTiles = [];
        values = {};
        score = 0;

        // Setting up the amount of each letter
        one = ["J", "K", "Q", "X", "Z"];
        two = ["B", "C", "F", "H", "M", "P", "V", "W", "Y", " "];
        three = ["G"];
        four = ["D", "S", "U", "L"];
        six = ["N", "R", "T"];
        eight = ["O"];
        nine = ["A", "I"];
        twelve = ["E"];
        setTiles(one, 1);
        setTiles(two, 2);
        setTiles(three, 3);
        setTiles(four, 4);
        setTiles(six, 6);
        setTiles(eight, 8);
        setTiles(nine, 9);
        setTiles(twelve, 12);

        function setTiles(arr, count) {
            $(arr).each(function() {
                // Here i'm getting the letter from the array
                var c = $(this)[0];
                // creating the array that has the val of the letter and it's count
                countTiles.push({val: c, count: count});
                for(var i = 0; i < count; i++) {
                    tiles.push(c);
                }
            });
        }
        // Setting up the values of each letters
        zeroValue = [" "];
        oneValue = ["L", "U", "S", "I", "N", "R", "O", "T", "A", "E", "X"];
        twoValue = ["G", "D"];
        threeValue = ["B", "P", "C", "M"]
        fourValue = ["V", "F", "W", "Y", "H"];
        fiveValue = ["K"];
        eightValue = ["J", "K"];
        tenValue = ["Q", "Z"];
        setValues(zeroValue, 0);
        setValues(oneValue, 1)
        setValues(twoValue, 2)
        setValues(threeValue, 3)
        setValues(fourValue, 4)
        setValues(fiveValue, 5)
        setValues(eightValue, 8)
        setValues(tenValue, 10)
        function setValues(arr, val) {
            $(arr).each(function(i, curr) {
                values[curr] = val;
            });
        }
    }
    // accessor for our dictionary
    function getValue(letter) {
        return values[letter];
    }
    // removes all of the initial values
    // creates a new rack
    function refreshBoard() {
        $(".rack-tile").remove();
        setupRack();
    }

    // Randomly gets seven tiles from the remaining tiles.
    function getRandomTiles(count) {
        var length = tiles.length;
        if(length <= 0) {
            throw "Out of tiles!";
        }
        var hand = [];
        for(var i = 0; i < count; i++) {
            rand = getRandomInt(length);
            length--;
            hand.push(tiles[rand]);
            tiles.splice(rand, 1);
        }
        return hand;
    }
    // gets a random int from the length proposed.
    function getRandomInt(length) {
        return Math.floor(Math.random() * (length - 1));
    }
});
