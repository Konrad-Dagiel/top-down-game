# top-down-game

To play, place files in a code editor. \n
If you don't have Flask installed: \n
$ pip install flask \n
Navigate terminal to app.py. \n
$ python -m flask run \n
Then in your browser: \n
localhost:5000 \n

This should bring you to the index.html page.

This game is written in JavaScript, HTML, CSS, Flask, Python, SQLite.

/* ****************************************************
        ADDITIONAL INFO
********************************************************
-THE GAME HAS 2 MODES AND 2 CHARACTERS

 *** STORY MODE IS MUCH MUCH EASIER ***

endless mode there is no winning, only survival
Create an account to have your 'high score' stored in the LEADERBOARD

in story mode, there is an end screen. It's really nothing exciting, but 
you can visit it by sticking '/endscreen' to the end of the URL,
---> cs1.ucc.ie/https://cs1.ucc.ie/~kd13/cgi-bin/ca2/run.py/endscreen
(or by beating the game of course)

1. the 'how to play' section in the main page contains all of the controls,
but basically arrows move space shoot, kill everything.
E and Q have their own little effects (depending on character)

2. when picking character, selecting the INFO link under their name will bring up 
a character specific guide

3. the dragon appears as the 'final boss' in story mode, 
or every 5 levels in endless mode.
I have done my best to make getting there managable.

4.in endless mode, every 3rd level contains bosses and every 5th level contains dragons.

5. the song used is copyright-free and free to use with no need for credit

      -----------------QUICK CLARITY---------------

If the page is refreshed during the game, the song doesn't start playing until the character moves.
this is because the document must be interracted with in order for audio to play AS OF CHROME 66
attempting to play audio before interraction with the window raises multiple errors in the console,
which are not programming errors
-----------------------------------------------------------------------------

Thanks and enjoy!
(I hope my terrible voice acting makes sitting through 100 games more barable)

*******************************************************************
*********************************************************************/
