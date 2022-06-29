from flask import Flask, render_template, redirect, url_for, session, g, request, jsonify
from database import get_db, close_db
from flask_session import Session
from forms import RegistrationForm, LoginForm
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps

app=Flask(__name__)
app.config['SECRET_KEY']='this-is-my-secret-key2'
app.config["SESSION_PERMANENT"]=False
app.config["SESSION_TYPE"]="filesystem"
Session(app)

@app.teardown_appcontext
def close_db_at_end_of_request(e=None):
    close_db(e)

@app.before_request
def load_logged_in_user():
    g.user=session.get('user_id', None)
    g.character=session.get('character',None)
    g.gamemode=session.get('gamemode',None)

def login_required(view):
    @wraps(view)
    def wrapped_view(**kwargs):
        if g.user is None:
            return redirect(url_for('login', next=request.url))
        return view(**kwargs)
    return wrapped_view

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/charselect')
def charselect():
    return render_template('charselect.html')

@app.route('/endscreen')
def endscreen():
    return render_template('endscreen.html')

@app.route('/marine67')
def marine67():
    session['character']='marine67'
    return render_template('game.html') #make character marine67
@app.route('/grim')
def grim():
    session['character']='grim'
    return render_template('game.html') #make character grim

@app.route('/endless')
def endless():
    session['gamemode']='endless'
    return render_template('charselect.html') #make mode endless

@app.route('/story')
def story():
    session['gamemode']='story'
    return render_template('charselect.html') #make mode story

@app.route('/howtoplay')
def howtoplay():
    return render_template('howtoplay.html')

@app.route('/get_settings')
def get_settings():
    return jsonify({"character":g.character , 'gamemode':g.gamemode})


@app.route('/modeselect')
def modeselect():
    return render_template('modeselect.html')

@app.route('/register', methods=['GET','POST'])
def register():
    form=RegistrationForm()
    if form.validate_on_submit():
        user_id=form.user_id.data
        password=form.password.data
        password2=form.password2.data
        db=get_db()
        if db.execute('''SELECT * FROM users WHERE user_id=?''',(user_id,)).fetchone() is not None:
            form.user_id.errors.append('Username Already Taken!')
        else:
            db.execute('''INSERT INTO users (user_id, password) VALUES (?,?);''',(user_id, generate_password_hash(password)))
            db.commit()
            return redirect(url_for('login'))
    return render_template('register.html', form=form)

@app.route('/login', methods=['GET','POST'])
def login():
    form=LoginForm()
    if form.validate_on_submit():
        user_id=form.user_id.data
        password=form.password.data
        db=get_db()
        user= db.execute('''SELECT * FROM users WHERE user_id =?;''',(user_id,)).fetchone()

        if user is None:
            form.user_id.errors.append('No such user found')
        elif not check_password_hash(user['password'],password):
            form.password.errors.append('Incorrect password')
        else:
            session['user_id']= user_id
            next_page=request.args.get('next')
            if not next_page:
                next_page=url_for('index')
            return redirect(next_page)
    return render_template('login.html',form=form)

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('index'))

@app.route('/leaderboard')
def leaderboard():
    db=get_db()
    top10=db.execute('''SELECT * FROM leaderboard ORDER BY score DESC LIMIT 10;''').fetchall()
    if g.user:
        you=db.execute('''SELECT * FROM leaderboard WHERE user_id=?;''',(g.user,)).fetchone()
        return render_template('leaderboard.html',top10=top10, you=you)

    return render_template('leaderboard.html',top10=top10)

@app.route('/store_score', methods=['POST'])
def store_score():
    if g.user is None:
        return redirect(url_for('index'))
    else:
        score=int(request.form['score'])
        db=get_db()
        user= db.execute('''SELECT * FROM leaderboard WHERE user_id =?;''',(g.user,)).fetchone()
        if user is None:
            db.execute('''INSERT INTO leaderboard (user_id,score) VALUES (?,?);''',(g.user,score))
            db.commit()
            return 'success'
        elif int(db.execute('''SELECT score FROM leaderboard WHERE user_id=?''',(g.user,)).fetchone()[0]) <= score:
            db.execute('''UPDATE leaderboard SET score=? WHERE user_id=?;''',(score,g.user))
            db.commit()
            return 'success'
        else:
            return 'fail'

@app.route('/marine67Info')
def marine67Info():
    return render_template('marine67Info.html')
@app.route('/grimInfo')
def grimInfo():
    return render_template('grimInfo.html')
         
