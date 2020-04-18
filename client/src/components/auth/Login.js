import React,{Fragment,useState} from 'react'
import {Link,Redirect} from 'react-router-dom'
import {connect} from 'react-redux'
import {login} from '../../actions/auth'
import PropTypes from 'prop-types'

const Login = ({login,isAuthenticated}) => {
    const [formData, setFormData] = useState({
        email:'',
        password :''
    })
    
    const {email,password} = formData;
    const handleChange = (e)=>setFormData({
        ...formData,
        [e.target.name] : e.target.value
    })

    const submitHandler = async (e)=>{
        e.preventDefault();
        //const {email,password} = formData;
        login({email,password});
    }

    if(isAuthenticated){
        return (<Redirect to="/dashboard" />)
    }

    return (
        <Fragment>
            <h1 className="large text-primary">Sign In</h1>
            <p className="lead"><i className="fas fa-user"></i> Sign into Your Account</p>
            <form className="form" action="dashboard.html">
                <div className="form-group">
                <input
                    type="email"
                    placeholder="Email Address"
                    name="email"
                    required
                    value={email}
                    onChange={handleChange}
                />
                </div>
                <div className="form-group">
                <input
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={password}
                    onChange={handleChange}
                />
                </div>
                <input onClick={submitHandler} type="submit" className="btn btn-primary" value="Login" />
            </form>
            <p className="my-1">
                Don't have an account? <Link to="/register">Sign Up</Link>
            </p>
        </Fragment>
    )
}

Login.prototype = {
    login: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool
}

const mapStatToProps = state=>({
    isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStatToProps,{login})(Login)
