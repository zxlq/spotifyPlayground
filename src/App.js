import React, { Component } from "react";
import CSspotify from "./images/CSspotify.png"; // gives image path
import { spotifyArray } from "./spotify.js";

// We now have our own reference to the addressBook array
// from external Javascript file
const localSpotify = spotifyArray;


function getBasketTotal(acc, obj){
  return acc + obj.price;

}
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
            searchTerm: "",
            len: 0,
            globalArray: localSpotify,
            shoppingbasket:[],
            NoOfItemsPurchased:0
          };

    this.onSearchFormChange = this.onSearchFormChange.bind(this);
    this.clearSearchBox = this.clearSearchBox.bind(this);
    this.onClickFillBasket = this.onClickFillBasket.bind(this);
    this.SongAddedtoBasket =this.SongAddedtoBasket.bind(this);
    this.CountStockUP = this.CountStockUP.bind(this);
    this.EmptyShoppingBasket = this.EmptyShoppingBasket.bind(this);
    //this.getBasketTotal =this.getBasketTotal.bind(this);

  } // end constructor
  /** This is the method called when the search form box changes **/
  /** Javascript will create an event object for you **/
  onSearchFormChange(event) {
    // We re-assign the state variable called searchTerm
    // event is understood by Javascript to be a change to a UI item
    this.setState({ searchTerm: event.target.value });
    let sTerm = event.target.value; // typed in value
    let numChars = sTerm.length;
    this.setState({ len: numChars });
  }
  // event function to clear the search box.
  // all we need to do is reset both of the state properties
  // associated with the text input box.
  clearSearchBox() {
    this.setState({ len: 0 });
    this.setState({ searchTerm: "" });
  }

  onClickFillBasket() {
    //this.setState({ len: 0 });
    this.setState({ searchTerm: "" });
  }


  SongAddedtoBasket(SongID) {
    console.log("SongID Added to Basket="+SongID);


      let foundObj = this.state.globalArray.filter(
        this.findObjectBySongID(SongID)
      )
      console.log("Song Found="+foundObj);

    this.setState({shoppingbasket:this.state.shoppingbasket.concat(foundObj)});
  }

  findObjectBySongID(SongIDtoFind){
    return function (songObject){
      return songObject.ID === SongIDtoFind;
    }

  }


  CountStockUP(itemsPurchased){

  console.log("UpStock object = "+itemsPurchased);

  }

  EmptyShoppingBasket(){

    this.setState({shoppingbasket:[]});

  }




  render() {
    return (
      <div className="App">
        <h1>Spotify Search App</h1>


        <img src={CSspotify} alt="this is our spotify" />
        <br />
        <br />
        You have <b>[{this.state.shoppingbasket.length}]</b> items in your shopping basket.

        <br />
        <br />
        <button onClick={this.EmptyShoppingBasket}>Empty Basket</button>
          <br />
          <br />

                    <table border="1">
                      <thead>
                        <tr>
                        <th>ID</th>
                          <th>Title</th>
                          <th>Artist</th>
                          <th>Genre</th>
                          <th>Price</th>



                        </tr>
                      </thead>
                      <tbody>
                        {this.state.shoppingbasket.map((a) => (
                            <tr key={a.ID}>

                            <td>
                              <b>{a.ID}</b>
                            </td>
                              <td>
                                <b>{a.title}</b>
                              </td>
                              <td>
                                <i>{a.artist}</i>
                              </td>
                              <td>{a.topgenre}</td>
                              <td>€{a.price}</td>


                            </tr>
                          ))}
                      </tbody>
                    </table>
                    <br />
                    <br />
          You have <b>€{this.state.shoppingbasket.reduce(getBasketTotal,0.0)}</b> value in your shopping basket.
          <br />
          <br />
          You have purchased <b>{this.state.shoppingbasket.length}</b> items.
            <br />
            <br />
        <br />
        Your current search is <b>[{this.state.searchTerm}]</b>. There are{" "}
        <b>[{this.state.len}]</b> characters typed.


        <SearchForm
          searchTerm={this.state.searchTerm}
          onChange={this.onSearchFormChange}
          onClickClear={this.clearSearchBox}
        />

        <SearchResults
                //search term gets passed down
                  searchTerm={this.state.searchTerm}
                  globalArray={this.state.globalArray}
                />

        <FillBasket
        SongAddedtoBasket={this.SongAddedtoBasket}
         />


      </div>
    ); // end of return statement
  } // end of render function
} // end of class

/** We use this component to display or render the results of search**/
class SearchResults extends Component {
  spotifyFilterFunction(searchTerm) {
    return function (spotifyObject) {
      // in the lab question we are asked for case
      // sensitive searching (this is a requirement)
      let title1 = spotifyObject.title;
      let artist = spotifyObject.artist;
      let genre = spotifyObject.topgenre;
      // we have to consider the requirement of the
      // searchTerm > 3 characters (this avoids showing)
      // results for the first few characters typed.
      return (
        searchTerm !== "" &&
        searchTerm.length > 3 &&
        (title1.includes(searchTerm) ||
          artist.includes(searchTerm) ||
          genre.includes(searchTerm))
      );// end of return statement
    };
  }

  render() {
    const arrayPassedAsParameter = this.props.globalArray;
    const searchTermFromProps = this.props.searchTerm;

    // let's calculate how many elements or obejcts are
    // in the array after the filter is applied.
    let numberResults = arrayPassedAsParameter.filter(
      this.spotifyFilterFunction(searchTermFromProps)
    ).length;

    return (
      <div className="SearchResultsDisplay">
        <hr />
        <h1>Search Results</h1>
        <p>
          Total Results:<b>{numberResults}</b>
        </p>
        <table border="1">
          <thead>
            <tr>
              <th>Title</th>
              <th>Artist</th>

            </tr>
          </thead>
          <tbody>
            {arrayPassedAsParameter
              .filter(this.spotifyFilterFunction(searchTermFromProps))
              .map((a) => (
                <tr key={a.ID}>
                  <td>
                    <b>{a.title}</b>
                  </td>
                  <td>
                    <i>{a.artist}</i>
                  </td>

                </tr>
              ))}
          </tbody>
        </table>
      </div>
    );
  }
} // close the SearchResults component

class SearchForm extends Component {
  render() {
    // this.props are the properties which are provided or passed
    // to this component. We have the searchTerm and we have the
    // onChange function.
    const searchTermFromProps = this.props.searchTerm;
    const onChangeFromProps = this.props.onChange;
    const onClickClear = this.props.onClickClear;
    return (
      <div className="SearchFormForm">
        <hr />
        Search Spotify List:
        <form>
          <b>Type your Spotify search here: </b>
          <input
            type="text"
            value={searchTermFromProps}
            onChange={onChangeFromProps}
          />
        </form>
        <button onClick={onClickClear}>Clear Search!</button>
      </div>
    );
  }
} // close the SearchForm Component


class FillBasket extends Component {

  render() {
    // this.props are the properties which are provided or passed
    // to this component. We have the searchTerm and we have the
    // onChange function.

    const onClickFillBasket = this.props.onClickFillBasket;

    //const stockCountInc = this.props.UpCountStock;

    //const sendnewData = this.props.SongAddedtoBasket;

    return (
      <div className="FillBasket">
        <hr />
        Show all on Spotify List:

        <button onClick={onClickFillBasket}>Show All!</button>
        <table border="1">
          <thead>
            <tr>
            <th>ID</th>
              <th>Title</th>
              <th>Artist</th>
              <th>Genre</th>
              <th>Year</th>
              <th>Price</th>

              <th>Buy </th>
            </tr>
          </thead>
          <tbody>
            {localSpotify
              .map((a) => (
                <tr key={a.ID}>
                <td>
                  <b>{a.ID}</b>
                </td>
                  <td>
                    <b>{a.title}</b>
                  </td>
                  <td>
                    <i>{a.artist}</i>
                  </td>
                  <td>{a.topgenre}</td>
                  <td>{a.year}</td>
                  <td>€{a.price}</td>

                  <td><button onClick={()=> this.props.SongAddedtoBasket(a.ID)}>
                  Buy</button></td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    );
  }
} // close the SearchForm Component

export default App;
