import React, { Component } from 'react';
import { ChatFeed, Message } from 'react-chat-ui'
import { db } from "../../Firebase/firestore";
import { auth } from '../../Firebase/auth';
import Navbar from '../../Components/Navbar';



class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      messages: [
        // new Message({ id: 1, message: "I'm the recipient! (The person you're talking to)"}), // Gray bubble
        // new Message({ id: 0, message: "I'm you -- the blue bubble!" }), // Blue bubble
        // new Message({ id: 3, message: "I'm the recipient! (The person you're talking to)"}), // Gray bubble
        // new Message({ id: 0, message: "I'm you -- the blue bubble!" }), // Blue bubble
        // new Message({ id: 5, message: "I'm the recipient! (The person you're talking to)"}), // Gray bubble
        // new Message({ id: 0, message: "I'm you -- the blue bubble!" }), // Blue bubble
      ],
      //...
    };
    //...
  }
  componentDidMount(){
    auth.onAuthStateChanged(user => {
      if(user) this.setState({user})
      else this.setState({user: null});
      console.log("state updated");  
    })
  }
  componentWillMount(){
    db.collection("chatRoom1").onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        if (change.type === "added") {
          // let newMsg = change.doc.data();
          // newMsg.id = newMsg.uid === auth.currentUser.uid ? 0 : newMsg.uid;
          let newMsg = [ new Message({
            id: change.doc.data().uid === auth.currentUser.uid ? 0 : change.doc.data().uid,
            message: change.doc.data().message,
            senderName: change.doc.data().name,
          }) ];
            console.log(newMsg);
          this.setState({ messages: newMsg.concat(this.state.messages) })
          // console.log("New Message Added: ", change.doc.data());
        }
        else{
          this.state.messages.reverse();
        }
      });
    });
  }
  SendNewMessage = () => {
    db.collection('chatRoom1').add(
      {
        message: document.getElementById('msgInput').value, 
        uid: this.state.user ? this.state.user.uid: null,
        name: this.state.user ? this.state.user.displayName: null,
      })
      .then(() => document.getElementById('msgInput').value = '')
  }
   
  render() {
    return (
      <div>
        <Navbar />
        
        <div className="container">
          <div className="card" style={{padding: 40, marginTop: 20}} >


          <div style={{display: 'flex'}} >

            <input 
              type='text' 
              id="msgInput"
              placeholder="Message..."
              style={{
                flexGrow: 1,
                marginRigth: 20,
                outline: 'none',
              }} 
            />
            <button 
              className='btn'
              onKeyUpCapture={event => {if(event.keyCode == 13) this.SendNewMessage()}}  
              onClick={this.SendNewMessage}
                style={{
                  marginLeft: 20,
                  background: 'black',
                  borderRadius: '100%',
                  width: 50,
                  height: 50,
                }}
              >
              {/* send */}
              <i class="material-icons right">send</i>
            </button>

          </div>
          {
            this.state.user ? 
          <div className="col s12 m8 l6" style={{maxHeight: 400, overflow: 'scroll', overflowX: 'hidden'}}>
            <ChatFeed
              messages={this.state.messages} // Boolean: list of message objects
              isTyping={false} // Boolean: is the recipient typing
              hasInputField={false} // Boolean: use our input, or use your own
              showSenderName={true} // show the name of the user who sent the message
              bubblesCentered={false} //Boolean should the bubbles be centered in the feed?
              // JSON: Custom bubble styles
              bubbleStyles={
                {
                  text: {
                    fontSize: 14
                  },
                  chatbubble: {
                    // borderRadius: 70,
                    padding: 10
                  }
                }
              }
            />
          </div>
        : null
        }
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;