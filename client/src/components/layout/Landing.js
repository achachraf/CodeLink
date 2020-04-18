import React, { Fragment, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import Spinner from "./Spinner";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-clike.js";
import "prismjs/components/prism-javascript.js";
import axios from "axios";
import ProfileItem from "./../Profiles/ProfileItem";
import Alert from "./Alert";

const Landing = ({ auth: { isAuthenticated, user, loading } }) => {
  const [search, setSearch] = useState("users.find()");

  const [state, setState] = useState({
    profiles: [],
    loading: false,
    error: ""
  });

  const keyPressed = async e => {
    if(e.keyCode == 13){
      e.preventDefault();
      await onSubmit();
      return
    }
    let val = e.target.value;
    let rightPart = val[e.target.selectionStart - 1];
    if (rightPart === ")" && e.keyCode != 37) {
      e.preventDefault();
    }
    if (e.keyCode == 8 || e.charCode == 45) {
      let leftPart = val.substring(0, e.target.selectionStart);
      let def = "users.find(";
      // console.log(leftPart)
      if (
        leftPart === def ||
        leftPart === def + ")" ||
        val === def + ")" ||
        rightPart === ")"
      ) {
        e.preventDefault();
      }
    }
  };

  const onSelect = e => {
    e.target.selectionStart = e.target.selectionEnd;
  };

  const onSubmit = async e => {
    //e.preventDefault();

    //start loading
    setState({
      ...state,
      loading: true,
      error: ""
    });

    //prepare query
    let query = search.substr(11);
    query = query.substr(0, query.length - 1);
    console.log(query);
    const config = {
      "Content-Type": "application/json"
    };
    try {
      const res = await axios.post("/api/search", { query }, config);
      console.log(res);
      setState({
        ...state,
        profiles: res.data,
        error: ""
      });
    } catch (err) {
      setState({
        ...state,
        loading: false,
        error: "Invalid Syntaxe !"
      });
    }
  };

  const exemple = "users.find({name:{$regex:'achraf'}})"
  return (
    <div className="land">
      <section>
        <div className="dark-overlay">
          <div className="landing-inner">
            <h1 className="x-large">Link Your Code</h1>
            <p className="lead">
              Create a developer profile/portfolio, share posts and get help
              from other developers
            </p>
            {loading ? (
              <Spinner />
            ) : isAuthenticated ? (
              <div className="buttons">
                {console.log(user)}
                <h1 >Welcome {user.name.split(" ")[0]} </h1>
                <Link to="/dashboard" className="btn btn-primary">
                  <i className="fas fa-user"></i> Dashboard
                </Link>
              </div>
            ) : (
              <div className="buttons">
                <Link to="/register" className="btn btn-primary">
                  Sign Up
                </Link>
                <Link to="/login" className="btn btn-light">
                  Login
                </Link>
              </div>
            )}
            <h1 className="explication">Search for users with MongoDB syntax</h1>
            <p className="avaliabe">Avaliabe fields:  
              <strong className="text-primary ">name</strong> 
              <strong className="text-primary">email</strong></p>
            <p className="explication-2">Ex: {exemple}</p>
            <div class="search">
              <Editor
                type="text"
                class="searchTerm"
                placeholder="Search for a profile using MongoDB Syntax..."
                value={search}
                onKeyDown={keyPressed}
                onValueChange={code => setSearch(code)}
                highlight={code => highlight(code, languages.js)}
                style={{
                  fontFamily: '"Fira code", "Fira Mono", monospace'
                }}
                onSelect={onSelect}
              />
              <button onClick={onSubmit} type="submit" class="searchButton">
                <i class="fa fa-search"></i>
              </button>
            </div>
          </div>
          {state.loading ? (
            <Spinner />
          ) : state.error === "" ? (
            <div className="profiles">
              {state.profiles.length > 0 ? (
                state.profiles.map(profile => {
                  return <ProfileItem key={profile._id} profile={profile} />;
                })
              ) : (
                <h4 className="no-profiles">No profiles found...</h4>
              )}
            </div>
          ) : (
            <div className={`alert alert-danger`}>{state.error}</div>
          )}
        </div>
      </section>
    </div>
  );
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(Landing);
