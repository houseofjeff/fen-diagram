//==============================================================================

function ChessBoard( divname, startingFEN, highlights) {

    // Make the board square within the div
    var div = $('#'+divname);
    var boardSize = Math.min(div.height(), div.width());

    var imageObj = new Image();
    imageObj.board = this;
    imageObj.startingFEN = startingFEN;

    // Create the canvas & context for this board
    var canvtag = '<canvas width="'+boardSize+'" height="'+boardSize+'">';
    var canvas = $(canvtag)[0];
    div.append(canvas);
    this.ctx = canvas.getContext("2d");

    // Some values that'll be reused
    this.squarePixels = boardSize/8;
    this.pieceMargin = this.squarePixels/10;
    this.pieceSize = this.squarePixels - (2*this.pieceMargin);

    this.iconHeight = 162;
    this.imgLookup = { 'R' : [0, 150],   'B' : [153, 178],  'Q' : [336, 176],
                       'K' : [515, 176], 'N' : [705, 170],  'P' : [888, 160] }

    this.lightColor = "#FFFFFF";
    this.darkColor = "#CCCCCC";
    this.lightHighlight = "#FFAA00"
    this.darkHighlight = "#FF7744";

    //-------------------------------------------------------------------------
    // Convert this rank from Forsyth-Edwards notation into an array
    // (including '' for blank spaces)

    this.fenRankToArray = function(rankStr) {
        var arry = [];

        for (var i = 0; i < rankStr.length; i++) {
            var ch = rankStr[i];
            if ((ch >= '1') && (ch <= '8')) {
                for (var j = 0; j < ch; j++)
                    arry.push('');
            }
            else
                arry.push(ch);
        }

        return arry;
    }

    //-------------------------------------------------------------------------
    // Redraw the board (by redrawing the squares)

    this.drawBoard = function(boardFEN, highlightMatrix) {
    	console.log("Drawing", boardFEN, highlightMatrix);
        var ranks = boardFEN.split('/');

        for (var j = 0; j < 8; j++) {
            var rank = fenRankToArray( ranks[j] );
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
            ctx.fillStyle = isDarkSquare ? this.darkHighlight : this.lightHighlight;
        else
            ctx.fillStyle = isDarkSquare ? this.darkColor : this.lightColor;
        
        var sqsz = this.squarePixels;
        this.ctx.fillRect( col*sqsz, row*sqsz, sqsz, sqsz );

        if (piece == '') 
            return

        var imgSettings = this.imgLookup[piece.toUpperCase()];
        var imgY = (piece[0] >= 'a') ? 0 : 224;

        this.ctx.drawImage( this.piecesImg,
                           imgSettings[0], imgY, 
                           imgSettings[1], this.iconHeight,
                           (col*sqsz)+this.pieceMargin,  (row*sqsz)+this.pieceMargin,
                           this.pieceSize, this.pieceSize );
    }
   
    imageObj.onload = function() {
        if ( typeof this.startingFEN === 'undefined' ) 
	    this.startingFEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";

        this.board.drawBoard(this.startingFEN, highlights);
    }
    this.piecesImg = imageObj;
    imageObj.src = 'pieces.png';

    return this;
}
