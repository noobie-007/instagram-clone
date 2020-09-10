import React, {useState, useEffect} from 'react';
import './App.css';
import Posts from './Posts';
import { db, auth } from './firebase';
import {makeStyles} from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, input } from '@material-ui/core';
import ImageUpload from './ImageUpload';


function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '1px solid skyblue',
    boxShadow: theme.shadows[2],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {

  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setopenSignIn] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);


  useEffect( () => {
      auth.onAuthStateChanged((authUser) => {
      if(authUser) {
        //user logged in....
        console.log(authUser);
        setUser(authUser);
      }
      else {
        //user logged out....
        setUser(null);
      }
    })
  }, [user, username]);

  useEffect( () => {
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })));
    })
  }, []);

  const signUp = (event) => {
    event.preventDefault();

    auth
    .createUserWithEmailAndPassword(email, password)
    .then((authUser) =>{
      return authUser.user.updateProfile({
        displayName: username
      })
    })
    .catch((error) => alert(error.message))

    setOpen(false);
  }

  const signIn = (event) => {
    event.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message))

    setopenSignIn(false);
  }

  return (
    <div className="app">
      <Modal
        open={open}
        onClose={ () => setOpen(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app-signup">
            <center>
                <img
                  src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                  alt=""
                />
            </center>
            <input
              placeholder="username"
              type="text"
              value={username}
              onChange={(e)=> setUsername(e.target.value)}
            />
            <input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e)=> setEmail(e.target.value)}
            />
            <input
              placeholder="password"
              type="text"
              value={password}
              onChange={(e)=> setPassword(e.target.value)}
            />
            <button type="submit" onClick={signUp}>sign up</button>
          </form>
        </div>
      </Modal>


      <Modal
        open={openSignIn}
        onClose={ () => setopenSignIn(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app-signup">
            <center>
                <img
                  src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                  alt=""
                />
            </center>
            <input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e)=> setEmail(e.target.value)}
            />
            <input
              placeholder="password"
              type="text"
              value={password}
              onChange={(e)=> setPassword(e.target.value)}
            />
            <button type="submit" onClick={signIn}>sign In</button>
          </form>
        </div>
      </Modal>


      <div className="app-header">
        <img
        className="header-image"
        src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
        alt="" />
        {user ? (
          <Button onClick={() => auth.signOut()}>Logout</Button>
          ) : (
          <div className="app__loginContainer">
            <Button onClick={() => setopenSignIn(true) }>Login </Button>
            <Button onClick={() => setOpen(true) }> SignUp</Button>
          </div>  
        )}
      </div>
      <div className="app-post">
        {
          posts.map(({id, post}) => (
            <Posts key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl} />
          ))
        }
      </div>
      
      {user?.displayName ? (
    <ImageUpload username={user.displayName} />
      ) : (
        <h3>Login To Upload</h3>
      )
    }
    </div>
  );
}

export default App;
