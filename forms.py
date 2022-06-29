from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField, PasswordField
from wtforms.validators import InputRequired, EqualTo, Length

class RegistrationForm(FlaskForm):
    user_id=StringField('user id', validators=[InputRequired(),Length(1,16)])
    password=PasswordField('password', validators=[InputRequired()])
    password2=PasswordField('retype password', validators=[InputRequired(), EqualTo('password')])
    submit=SubmitField('submit')
class LoginForm(FlaskForm):
    user_id=StringField('user id', validators=[InputRequired()])
    password=PasswordField('password', validators=[InputRequired()])
    submit=SubmitField('submit')