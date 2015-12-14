//==============================================================================
// fen-diagram by houseofjeff (https://github.com/houseofjeff/fen-diagram)

function FEN_Diagram( divname, startingFEN, options) {
    var options = options || {};

    // Make the board square within the div
    var div = document.getElementById(divname);
    var boardSize = Math.min(div.scrollHeight, div.scrollHeight);

    // Create the canvas & context for this board
    var canvtag = document.createElement('canvas');
    canvtag.height = canvtag.width = boardSize; 
    div.appendChild(canvtag);
    this.ctx = canvtag.getContext("2d");

    // Some values that'll be reused
    this.squarePixels = boardSize/8;
    this.pieceMargin = this.squarePixels/10;
    this.pieceSize = this.squarePixels - (2*this.pieceMargin);

    this.iconHeight = 162;
    this.imgLookup = { 'R' : [0, 150],   'B' : [153, 178],  'Q' : [336, 176],
                       'K' : [515, 176], 'N' : [705, 170],  'P' : [878, 160] }

    this.lightColor = options["lightColor"] || "#FFFFFF";
    this.darkColor = options["darkColor"] || "#CCCCCC";
    this.lightHighlight = options["lightHighlight"] || "#FFAA00";
    this.darkHighlight = options["darkHighlight"] || "#FF7744";
    this.highlights = options["highlights"];

    //-------------------------------------------------------------------------
    // Convert this rank from Forsyth-Edwards notation into an array
    // (including '' for blank spaces)

    this.fenRankToArray = function(rankStr) {
        var arry = [];

        for (var i = 0; i < rankStr.length; i++) {
            var ch = rankStr[i];
            if ((ch >= '1') && (ch <= '8')) 
                arry = arry.concat(Array(parseInt(ch)));
            else
                arry.push(ch);
        }

        return arry;
    }

    //-------------------------------------------------------------------------
    // Redraw the board (by redrawing the squares)

    this.drawBoard = function(boardFEN) {
        var highlightMatrix = this.highlights
    	console.log("Drawing", boardFEN, highlightMatrix);
        var ranks = boardFEN.split('/');

        for (var j = 0; j < 8; j++) {
            var rank = this.fenRankToArray( ranks[j] );
            for (var i = 0; i < 8; i++) {
                var highlighted = (typeof highlightMatrix === 'undefined') ? false : highlightMatrix[j][i] == 1;
                var piece = (boardFEN == null) ? '' : rank[i];
                this.drawSquare( i, j, piece, highlighted );
            }
        }
    }


    //-------------------------------------------------------------------------
    // Redraw the squares, one at a time.  

    this.drawSquare = function (col, row, piece, highlighted) {
        var isDarkSquare = ((row%2) + (col%2)) == 1;

        if (highlighted) 
            this.ctx.fillStyle = isDarkSquare ? this.darkHighlight : this.lightHighlight;
        else
            this.ctx.fillStyle = isDarkSquare ? this.darkColor : this.lightColor;
        
        var sqsz = this.squarePixels;
        this.ctx.fillRect( col*sqsz, row*sqsz, sqsz, sqsz );

        if (piece == null) 
            return

        var imgSettings = this.imgLookup[piece.toUpperCase()];
        var imgY = (piece[0] >= 'a') ? 0 : 224;

        this.ctx.drawImage( this.piecesImg,
                           imgSettings[0], imgY, 
                           imgSettings[1], this.iconHeight,
                           (col*sqsz)+this.pieceMargin,  (row*sqsz)+this.pieceMargin,
                           this.pieceSize, this.pieceSize );
    }
   
    // Finally, load the image file and, when it arrives, draw the board
    this.piecesImg = new Image();
    this.piecesImg.board = this;
    this.piecesImg.onload = function() {
        this.board.drawBoard( startingFEN || "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR" );
    }
    this.piecesImg.src = 'pieces.png';
}
