import React,{Fragment,useState} from 'react'
import {Link, Redirect} from 'react-router-dom'
import PropTypes from 'prop-types'
import {setAlert} from '../../actions/alert'
import {connect} from 'react-redux'
import { register } from '../../actions/auth';

const Register = ({setAlert,register,isAuthenticated}) => {
    const [formData, setFormData] = useState({
        name:'',
        email:'',
        password :'',
        password2 :''
    })
    const {name,email,password,password2} = formData
    const handleChange = (e)=>setFormData({
        ...formData,
        [e.target.name] : e.target.value
    })
    const handleSubmit = (e)=>{
        e.preventDefault();
        if(password !== password2){
            console.log("Passwords don't match");
            setAlert("Passwords don't match","danger",5000);
                                               
        }
        else{
            register({name,email,password});
        }
    }

    if(isAuthenticated){
        return (<Redirect to="/dashboard" />)
    }

    return (
        <Fragment>
            <h1 className="large text-primary">Sign Up</h1>
            <p className="lead"><i className="fas fa-user"></i> Create Your Account</p>
            <form className="form" action="create-profile.html" onSubmit={handleSubmit}>
                <div className="form-group">
                <input type="text" placeholder="Name" name="name" onChange={handleChange} value={name} />
                </div>
                <div className="form-group">
                <input type="email" placeholder="Email Address" name="email" onChange={handleChange} value={email}  />
                <small className="form-text"
                    >This site uses Gravatar so if you want a profile image, use a
                    Gravatar email</small>
                </div>
                <div className="form-group">
                <input
                    type="password"
                    placeholder="Password"
                    name="password"
                    onChange={handleChange}
                    value={password}
                />
                </div>
                <div className="form-group">
                <input
                    type="password"
                    placeholder="Confirm Password"
                    name="password2"
                    onChange={handleChange}
                    value={password2}
                />
                </div>
                <input type="submit" className="btn btn-primary" value="Register" />
            </form>
            <p className="my-1">
                Already have an account? <Link to="/login">Sign In</Link>
            </p>
        </Fragment>
    )
}

Register.propTypes = {
    setAlert : PropTypes.func.isRequired,
    register : PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool
}

const mapStatToProps = state=>({
    isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStatToProps,{
    setAlert,
    register
})(Register)


