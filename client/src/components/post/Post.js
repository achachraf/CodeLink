import React,{useEffect, Fragment} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import Spinner from './../layout/Spinner'
import {getPostById} from './../../actions/post'
import PostItem from '../posts/PostItem'
import { Link } from 'react-router-dom'
import CommentForm from './CommentForm'
import CommentItem from './CommentItem'

const Post = ({post:{post,loading},getPostById,match}) => {
    
    useEffect(()=>{
        getPostById(match.params.id)
    },[])

    return loading || post === null ? (<Spinner />):(<Fragment>
        <Link to="/posts" className="btn">
            Go Back        
        </Link>
        <PostItem post={post} showActions={false} />
        <CommentForm postId={post._id} />
        <div className="comments">
            {post.comments.map(comment=>(
                <CommentItem comment={comment} postId={post._id} />
            ))}
        </div>
    </Fragment>)
}

Post.propTypes = {

}

const mapStateToProps = state => ({
    post: state.post
})

export default connect(mapStateToProps,{getPostById})(Post)
