import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.css';
import * as serviceWorker from './serviceWorker';
import axios from 'axios';
import { BrowserRouter, Route, Link } from 'react-router-dom';
     
//const API_BASE = 'https://myrails-kurmasz.codeanyapp.com';
const API_BASE = '';

		class Hello extends React.Component {
		  render()  {return <div>Hello!</div>}
		}
		
		class Goodbye extends React.Component {
		  render()  {return <div>Goodbye!</div>}
		}


		const AuthorListItem  = (props) =>  {
		  return (
		    <tr>
		        <td>{props.fname}</td>
		        <td>{props.lname}</td>
		        <td>{props.email}</td>
		        <td className="btn-toolbar">
		          <button className="btn btn-success btn-sm" onClick={event => props.onEdit("edit",props)}>
		            <i className="glyphicon glyphicon-pencil"></i> Edit
		          </button>
		          <button className="btn btn-danger btn-sm" onClick={event => props.onDelete(props.id)}>
		            <i className="glyphicon glyphicon-remove"></i> Delete
		          </button>
		        </td>
		      </tr>
		  );
		}

		class AuthorForm extends React.Component {
		
		  constructor(props) {
		    super(props);
		    this.state = {
		      fname: props.author.fname,
		      lname: props.author.lname,
		      email:  props.author.email,
		      id: props.author.id
		    };
    this.handleInputChange = this.handleInputChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleCancel = this.handleCancel.bind(this); 
		  }
		
      
      handleInputChange(event) {
        console.log("Input change detected");
        console.dir(event.target);
		    const target = event.target;
		    const value = target.value;
		    const name = target.name;
        console.log(target.name);
        console.log(target.value);
		    this.setState({
		      [name]: value
		    });
		  }
		
		  handleSubmit(event)
		  {
		      this.props.onSubmit({
		        fname: this.state.fname,
		        lname: this.state.lname,
		        email: this.state.email,
		        id: this.state.id,
		      });
		      event.preventDefault();
		  }
		
		  handleCancel(event)
		  {
		    this.props.onCancel("new", {fname:"", lname:"", email:"", id: "9999999"});
		    event.preventDefault();
		  }
      
      
		  renderButtons() {
		    if (this.props.formMode === "new") {
		      return(
		        <button type="submit" className="btn btn-primary">Create</button>
		      );
		    } else {
		      return(
		        <div className="form-group">
		          <button type="submit" className="btn btn-primary">Save</button>
		          <button type="submit" className="btn btn-danger" onClick={this.handleCancel} >Cancel</button>
		        </div>
		      );
		    }
		  }
		  		
		  render()  {
		    return (
		      <div className="author-form">
		        <h1> Authors </h1>
		        <form onSubmit={this.handleSubmit}>
		          <div className="form-group">
		            <label>First Name</label>
		            <input type="text" className="form-control" autoComplete='given-name' name="fname" id="fname" placeholder="First Name" value={this.state.fname} onChange={this.handleInputChange}/>
		          </div>
		          <div className="form-group">
		            <label htmlFor="lname">Last Name</label>
		            <input type="text" className="form-control" autoComplete='family-name' name="lname" id="lname" placeholder="Last Name" value={this.state.lname} onChange={this.handleInputChange}/>
		          </div>
		          <div className="form-group">
		            <label htmlFor="email">Email address</label>
		            <input type="email" className="form-control" autoComplete='email' name="email"  id="email" placeholder="name@example.com" value={this.state.email} onChange={this.handleInputChange}/>
		          </div>
		          {this.renderButtons()}
		        </form>
		      </div>
		    );
		  }
		}
		
		const AuthorList = (props) => {
		  const authorItems = props.authors.map((author)  => {
		    return (
		      <AuthorListItem
		        fname={author.fname}
		        lname={author.lname}
		        email={author.email}
		        id={author.id}
		        key={author.id}
		        onDelete={props.onDelete}
		        onEdit={props.onEdit}
		       />
		    )
		  });
		
		  return (
		    <div className="author-list container">
		      <table className="table table-hover">
		        <thead>
		          <tr>
		            <th>First Name</th>
		            <th>Last Name</th>
		            <th>Email</th>
		            <th>Actions</th>
		          </tr>
		        </thead>
		        <tbody>
		          {authorItems}
		        </tbody>
		      </table>
		    </div>
		  );
		}
    
    		class Authors extends React.Component {
		
         loadAuthors_old() {
		    this.setState({
		      authors: [
		        {fname: "sam", lname: "iam", email: "sam@aol.com"},
		        {fname: "jane", lname: "doe", email: "jane@aol.com"},
		        {fname: "fred", lname: "bear", email: "fred@aol.com"},
		        {fname: "ted", lname: "tooy", email: "ted@aol.com"},
		      ]}
		    );
		  }
          
      loadAuthors() {
		    axios
		      .get(`${API_BASE}/authors.json`)
		      .then(res => {
		              this.setState({ authors: res.data });
		            })
		      .catch(err => console.log(err));
		  }	    
          
          
      		  addAuthor(newAuthor) {
		    axios
		      .post(`${API_BASE}/authors.json`, newAuthor)
		      .then(res => {
          console.log("Successful post");
          console.log(res);
		        res.data.key = res.data.id;
		        this.setState({ authors: [...this.state.authors, res.data] });
		      })
		      .catch(err => console.log(err));
		  }
		
		  updateAuthor(author) {
		    axios
		      .put(`${API_BASE}/authors/${author.id}.json`, author)
		      .then(res => {
              console.log("Successful update from API");
		          this.loadAuthors();
		      })
		      .catch(err => console.log(err));
		  }
		
		  removeAuthor(id) {
		    let filteredArray = this.state.authors.filter(item => item.id !== id)
		    this.setState({authors: filteredArray});
		    axios
		      .delete(`${API_BASE}/authors/${id}.json`)
		      .then(res => {
		              console.log(`Record Deleted`);
		              //this.clearForm();
		            })
		      .catch(err => console.log(err));
		  }
    
      updateForm(mode, authorVals) {
		      this.setState({
		        author: Object.assign({}, authorVals),
		        formMode: mode,
		      });
		  } 
          
      clearForm()
		  {
		    console.log("clear form");
		    this.updateForm("new",{fname:"",lname:"",email:"", id: "99999999"});
		  }    
          
                    
		  constructor(props) {
		    super(props);        
		    this.state = {
		      authors: [],
            formMode: "new",
            author: {lname:"", fname:"", email:"", id: "999999"}
		    };
        this.loadAuthors = this.loadAuthors.bind(this);
        this.removeAuthor = this.removeAuthor.bind(this);
        this.addAuthor = this.addAuthor.bind(this);
        this.updateAuthor = this.updateAuthor.bind(this);
        this.updateForm = this.updateForm.bind(this);
        this.clearForm = this.clearForm.bind(this);
		  }
          
      componentDidMount() {
		    this.loadAuthors();
		  }
          
      formSubmitted(author) {
		      if(this.state.formMode === "new") {
		        this.addAuthor(author);
		      } else {
		        this.updateAuthor(author);
		      }
		      this.clearForm();
		  } 
          
			render() {        
		    return (
		      <div className="authors">
		        <AuthorForm
		          onSubmit={(author) => this.formSubmitted(author)}
		          onCancel={(mode,author) => this.updateForm(mode,author)}
		          formMode={this.state.formMode}
		          author={this.state.author}
              key={this.state.author.id}
		        />
		        <AuthorList
		          authors={this.state.authors}
		          onDelete={(id) => this.removeAuthor(id)}
		          onEdit={(mode,author) => this.updateForm(mode,author)}
		        />
		      </div>
		    );
		  }
		}	

    ReactDOM.render(<BrowserRouter>
		      <div>
                    	        <ul>
		          <li><Link to="/">Home</Link></li>
		          <li><Link to="/hello">Hello</Link></li>
		          <li><Link to="/goodbye">Goodbye</Link></li>
		        </ul>
             
                    <Switch>
		        <Route exact path="/hello" component={Hello} />
		        <Route exact path="/goodbye" component={Goodbye} />
            <Route exact path="/" component={Authors} />
                    </Switch>
                 
		      </div>
		    </BrowserRouter>  
                    , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
