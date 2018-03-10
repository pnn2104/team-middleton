import React, {Component} from 'react';
import {Draggable, Droppable} from 'react-drag-and-drop';
import Slider from 'react-slick';
import FaClose from 'react-icons/lib/fa/close';
import axios from 'axios';

export default class Inventory extends Component {
  constructor(props) {
    super(props);
    this.clickItem = this.clickItem.bind(this);
    this.clickBox = this.clickBox.bind(this);
    this.clickSearch = this.clickSearch.bind(this);
    this.deleteSearch = this.deleteSearch.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.dropBack = this.dropBack.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleDeleteBox = this.handleDeleteBox.bind(this);
    this.getGuts = this.getGuts.bind(this);
    this.deleteGuts = this.deleteGuts.bind(this);
    this.handleDeleteFromBox = this.handleDeleteFromBox.bind(this);
    this.state = {
      newItem: '',
      newBox: '',
      listItems: [],
      listBox: {},
      user: '',
      search: '',
      toDeleteBox: '',
    };
  }

  componentWillMount() {
    this.setState({user: JSON.parse(sessionStorage.getItem('user'))})
  }

  componentDidMount() {
    const {user} = this.state;
    console.log("user: ", user)
    axios.post('/getItemsNoBox', {user}).then(data => {
      var arr = [];
      console.log("data: ", data);
      data.data.map(i => arr.push(i.name));
      this.setState({listItems: arr}, () => {
        axios.post('/getBoxes', {user}).then(result => {
          var array = {};
          result.data.map(j => {
            array[j.name] = [];
          });
          console.log('boxes: ', array);
          this.setState({listBox: array}, () => {
            var listOfBoxes = Object.keys(this.state.listBox);
            Promise.all(listOfBoxes.map(this.getGuts)).then(arrayOfData => {
              var myStorage = JSON.parse(JSON.stringify(this.state.listBox));
              arrayOfData.map((one, ind) => {
                one.data.map(each => {
                  myStorage[listOfBoxes[ind]].push(each.name);
                });
              });
              this.setState({listBox: myStorage});
            });
          });
        });
      });
    });
  }
  getGuts(name) {
    return axios.post('/getItemsByBox', {user: this.state.user, boxName: name});
  }

  deleteGuts(item) {
    var {user, toDeleteBox} = this.state;
    return axios.post('/deleteItemByBox', {user, boxName: toDeleteBox, item});
  }

  handleDelete(item) {
    var {user} = this.state;
    var array = this.state.listItems.slice();
    array.splice(array.indexOf(item), 1);
    this.setState({listItems: array}, () => {
      axios.post('/deleteItem', {user, item});
    });
  }

  handleDeleteFromBox(item, boxName) {
    var {user} = this.state;
    var storage = JSON.parse(JSON.stringify(this.state.listBox));
    var array = storage[boxName].slice();
    array.splice(array.indexOf(item), 1);
    storage[boxName] = array;
    console.log(user, item, boxName);
    this.setState({listBox: storage}, () => {
      axios.post('/deleteItemByBox', {user, item, boxName});
    });
  }

  handleDeleteBox(item) {
    var {user} = this.state;
    var storage = JSON.parse(JSON.stringify(this.state.listBox));
    var arrayToDelete = storage[item].slice();
    if (
      confirm('Do you want to delete whole box with all that crap inside?!')
    ) {
      delete storage[item];
      this.setState({listBox: storage, toDeleteBox: item}, () => {
        axios.post('/deleteBox', {user, boxName: item}).then(() => {
          Promise.all(arrayToDelete.map(this.deleteGuts)).then(() =>
            console.log('DELETED!'),
          );
        });
      });
    }
  }

  deleteSearch() {
    var storage = JSON.parse(JSON.stringify(this.state.listBox));
    var uncolor = function(array) {
      var arr = [];
      array.map(i => arr.push(i.replace('<mark>', '').replace('</mark>', '')));
      return arr;
    };

    for (var k in storage) {
      if (storage[k].length > 0) {
        storage[k] = uncolor(storage[k]);
      }
    }
    this.setState({listBox: storage});
  }

  clickSearch() {
    var {search} = this.state;
    if (search) {
      var color = function(array, filter) {
        var newArr = [];
        array.map(i => {
          if (i.includes(filter)) {
            newArr.push(i.replace(filter, `<mark>${filter}</mark>`));
          } else {
            newArr.push(i);
          }
        });
        return newArr;
      };
      async function someAsyncFunc(that) {
        console.log('HERE IS THIS BEFORE: ', that);
        await that.deleteSearch();
        console.log('HERE IS that after: ', that);
        var storage = JSON.parse(JSON.stringify(that.state.listBox));
        for (var k in storage) {
          storage[k] = color(storage[k], search);
        }
        that.setState({listBox: storage});
      }
      someAsyncFunc(this);
    }
  }

  clickBox() {
    if (this.state.newBox) {
      var {user} = this.state;
      var name = this.state.newBox;
      let storage = JSON.parse(JSON.stringify(this.state.listBox));
      storage[name] = [];
      this.setState({listBox: storage, newBox: ''}, () => {
        axios.post('/postBox', {user, boxName: name});
      });
    }
  }

  clickItem() {
    if (this.state.newItem) {
      var item = this.state.newItem;
      this.setState(
        {
          listItems: this.state.listItems.concat(item),
          newItem: '',
        },
        () => {
          axios.post('/postItemNoBox', {user: this.state.user, item: item});
        },
      );
    }
  }

  onDrop(item, box) {
    var {user} = this.state;
    var thing = JSON.parse(item.item);
    var {name, fromBox} = thing;
    var storage = JSON.parse(JSON.stringify(this.state.listBox));
    storage[box].push(name);
    if (fromBox) {
      // from BOX to another BOX
      storage[fromBox].splice(storage[fromBox].indexOf(name), 1);
      this.setState({listBox: storage}, () => {
        axios.post('/itemFromBoxToBox', {
          user,
          item: name,
          fromBox: fromBox,
          toBox: box,
        });
      });
    } else {
      // from LIST to some BOX
      var array = this.state.listItems.slice();
      var ind = array.indexOf(name);
      array.splice(ind, 1);
      axios
        .post('/itemFromEmptyToBox', {
          user: user,
          item: name,
          toBox: box,
        })
        .then(() => {
          this.setState({
            listBox: storage,
            listItems: array,
          });
        });
    }
  }

  dropBack(item) {
    // from box to the list back
    let thing = JSON.parse(item.item); //{name: "itemitself", fromBox: ""}
    let storage = JSON.parse(JSON.stringify(this.state.listBox));
    let {name, fromBox} = thing;
    storage[fromBox].splice(storage[fromBox].indexOf(name), 1);
    var array = this.state.listItems.slice();
    array.push(name);
    axios
      .post('/itemFromBoxToEmpty', {
        user: this.state.user,
        item: name,
        fromBox: fromBox,
      })
      .then(() => {
        this.setState({listBox: storage, listItems: array});
      });
  }

  render() {
    const settings = {
      dots: true,
      //infinite: true,
      speed: 700,
      slidesToShow: 3,
      slidesToScroll: 1,
    };
    return (
      <div className="container" style={{maxWidth: "1000px", margin: "50px"}}>
        <div className="edit">
          <h1>Inventory</h1>
          <div className="inventory-search-container">
    
          <input
            placeholder="search item"
            onChange={e => this.setState({search: e.target.value})}
            value={this.state.search}
          />
          <span>
          <button onClick={() => this.clickSearch()}>Search</button>
          </span>
          <span>
          <button onClick={() => this.deleteSearch()}>Delete query</button>
          </span>
           </div>
           <div className="inventory-addItem-container">
          <input

            placeholder="add item"
            onChange={e => this.setState({newItem: e.target.value})}
            value={this.state.newItem}
          />
          <div>
          <button onClick={() => this.clickItem()}>Submit</button>
          </div>
          </div>
          <span className="inventory-addBox-container">
          <input
            placeholder="add box name"
            onChange={e => this.setState({newBox: e.target.value})}
            value={this.state.newBox}
          />
          <div>
          <button onClick={() => this.clickBox()}>Submit</button>
          </div>
          </span>
          {
            <Droppable
              style={{
                border: 'solid 1px black',
                height: '100px',
                width: '80%',
                margin: '5px',
                backgroundColor: 'lightyellow',
                padding: '5px',
                minHeight: '100px',
                height: 'auto',
              }}
              types={['item']}
              onDrop={e => this.dropBack(e)}>
              <div>
                {this.state.listItems.map((item, i) => (
                  <Draggable
                    style={{
                      border: 'dotted 1px black',
                      display: 'inline-block',
                      margin: '3px',
                      padding: '3px',
                    }}
                    key={i}
                    type="item"
                    data={JSON.stringify({name: item, fromBox: null})}>
                    <div>
                      {item} <FaClose onClick={() => this.handleDelete(item)} />
                    </div>
                  </Draggable>
                ))}
              </div>
            </Droppable>
          }
        </div>
        <div className="inventory">
          <Slider {...settings}>
            {Object.keys(this.state.listBox).map((itm, j) => (
              <div key={j} className="slick-slide">
                <Droppable
                  style={{
                    border: 'solid 1px black',
                    height: '200px',
                    width: '200px',
                    margin: '5px',
                    height: 'auto',
                    minHeight: '200px',
                  }}
                  id={itm}
                  types={['item']}
                  onDrop={e => this.onDrop(e, itm)}>
                  <div>
                    name of box: {itm}{' '}
                    <FaClose onClick={() => this.handleDeleteBox(itm)} />
                  </div>
                  {this.state.listBox[itm].map((each, k) => (
                    <div>
                      <Draggable
                        key={k}
                        type="item"
                        data={JSON.stringify({name: each, fromBox: itm})}
                        style={{
                          width: 'auto',
                          border: 'dotted 1px black',
                          margin: '3px',
                          padding: '3px',
                          wordWrap: 'break-word',
                        }}>
                        <div style={{overflow: 'hidden'}}>
                          <div
                            style={{float: 'left'}}
                            dangerouslySetInnerHTML={{__html: `${each}`}}
                          />{' '}
                          <FaClose
                            style={{float: 'right'}}
                            onClick={() => this.handleDeleteFromBox(each, itm)}
                          />
                        </div>
                      </Draggable>
                    </div>
                  ))}
                </Droppable>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    );
  }
}
