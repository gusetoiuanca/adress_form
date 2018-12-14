import React, { Component } from 'react';
import './App.css';
import { FormGroup, FormControl, ControlLabel, Form, Button, Label } from 'react-bootstrap';
import ButlerClass from './libs/butler.js';
let Butler = new ButlerClass();
let validator = require('validator');
// Require `PhoneNumberFormat`.
const PNF = require('google-libphonenumber').PhoneNumberFormat;
const validLocales = ['AD', 'AT', 'AU', 'BE', 'BG', 'CA', 'CH', 'CZ', 'DE', 'DK', 'DZ', 'EE', 'ES', 'FI', 'FR', 'GB', 'GR', 'HR', 'HU', 'IL', 'IN', 'IS', 'IT', 'JP', 'KE', 'LI', 'LT', 'LU', 'LV', 'MX', 'NL', 'NO', 'PL', 'PT', 'RO', 'RU', 'SA', 'SE', 'SI', 'TN', 'TW', 'US', 'ZA', 'ZM'];
// Get an instance of `PhoneNumberUtil`.
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();


class App extends Component {
  constructor(props, context) {
    super(props, context);
    this.handleChangeCountry = this.handleChangeCountry.bind(this);
    this.onBlurPostalCode = this.onBlurPostalCode.bind(this);
    this.onBlurPhoneNumber = this.onBlurPhoneNumber.bind(this);
    this.onBlurEmailAddress = this.onBlurEmailAddress.bind(this);
    this.submitAddressForm = this.submitAddressForm.bind(this);
    this.state = {
      countries: [],
      cities: {},
      selectedCountry: null,
      name: null,
      address: null,
      postalCode: null,
      emailAddress: null,
      phoneNumber: null
    };
  }

  // necessary to be an async function because we use await to load data asynchronous
  async componentDidMount() {
    // check state for info before making the api request
    if (this.state.countries.length === 0) {
      let content = await Butler.loadCountries();
      content.unshift({ code: 'all', name: 'Select a country' });
      this.setState({ countries: content });
    }
  }

  // necessary to be an async function because we use await to load data asynchronous
  async handleChangeCountry(event) {
    let target = event.target;
    let content = [];
    if (!this.state.cities[target.value]) {
      content = await Butler.loadCities(target.value);
    } else {
      content = this.state.cities[target.value];
    }
    this.state.cities[target.value] = content;
    this.setState({
      selectedCountry: target.value,
      cities: this.state.cities,
      phoneNumberError: null,
      postalCodeError: null
    });
  }

  onBlurPhoneNumber(e) {
    let { selectedCountry } = this.state;

    if (!selectedCountry) {
      this.setState({ phoneNumberError: 'Select a country first' })
    } else {
      let phoneNumber = null;
      try {
        phoneNumber = phoneUtil.parse(e.target.value, selectedCountry);
        if (!phoneUtil.isValidNumberForRegion(phoneNumber, selectedCountry)) {
          this.setState({ phoneNumberError: 'Not a valid phone number' })
        } else {
          this.setState({ phoneNumberError: null })
        }
      } catch (e) {
        this.setState({ phoneNumberError: 'Not a valid phone number' })
      }
    }
  }

  onBlurEmailAddress(e) {
    if (!validator.isEmail(e.target.value)) {
      this.setState({ emailError: 'Not a valid email address' })
    } else {
      this.setState({ emailError: null })
    }
  }

  onBlurPostalCode(e) {
    let { selectedCountry } = this.state;

    if (!selectedCountry) {
      this.setState({ postalCodeError: 'Select a country first' })
    } else {
      if (validLocales.indexOf(selectedCountry) < 0) {
        selectedCountry = 'any';
      }
      if (!validator.isPostalCode(e.target.value, selectedCountry)) {
        this.setState({ postalCodeError: 'Not a valid postal code' })
      } else {
        this.setState({ postalCodeError: null })
      }
    }
  }

  async submitAddressForm(e) {
    e.preventDefault();
    let city = document.getElementById("city");
    let selectedCity = city.options[city.selectedIndex].text;
    let addUser = {
      email: document.getElementById('email').value,
      postalCode: document.getElementById('postalCode').value,
      phone: document.getElementById('phone').value,
      country: this.state.selectedCountry,
      city: selectedCity,
      name: document.getElementById('name').value,
      address: document.getElementById('address').value
    }
    await Butler.addUser(addUser);
  }

  render() {
    let { countries, selectedCountry, postalCodeError, emailError, phoneNumberError } = this.state;
    let cities = this.state.cities[selectedCountry] || [];

    return (
      <div className="App-content">
        <Form onSubmit={this.submitAddressForm}>
          <FormGroup>
            <ControlLabel>Name</ControlLabel>
            <FormControl type="text" className="form-control" id="name" placeholder="Enter your name" required />
          </FormGroup>

          <FormGroup>
            <ControlLabel>Address</ControlLabel>
            <FormControl componentClass="textarea" id="address" placeholder="Enter your address here" required />
          </FormGroup>

          <FormGroup>
            <ControlLabel>Country</ControlLabel>
            <FormControl componentClass="select" id="country" onChange={this.handleChangeCountry} required>
              {countries.map(item => (
                <option value={item.code} key={item.code}>
                  {item.name}
                </option>
              ))}
            </FormControl>
          </FormGroup>

          <FormGroup>
            <ControlLabel>State/province</ControlLabel>
            <FormControl componentClass="select" id="city" disabled={!selectedCountry && "disabled"} required>
              {cities.map(item => (
                <option value={item.code} key={item.code}>
                  {item.name}
                </option>
              ))}
            </FormControl>
          </FormGroup>

          <FormGroup>
            <ControlLabel>Postal Code</ControlLabel>
            <FormControl type="text" className="form-control" id="postalCode" placeholder="Enter postal code" onBlur={this.onBlurPostalCode} required />
            {postalCodeError && <Label bsStyle="danger">{postalCodeError}</Label>}

          </FormGroup>

          <FormGroup>
            <ControlLabel>Email address</ControlLabel>
            <FormControl type="email" className="form-control" id="email" placeholder="Enter email" onBlur={this.onBlurEmailAddress} required />
            {emailError && <Label bsStyle="danger">{emailError}</Label>}

          </FormGroup>


          <FormGroup>
            <ControlLabel>Phone number</ControlLabel>
            <FormControl type="phone" className="form-control" id="phone" placeholder="Enter phone number" onBlur={this.onBlurPhoneNumber} required />
            {phoneNumberError && <Label bsStyle="danger">{phoneNumberError}</Label>}

          </FormGroup>

          <Button type="submit" className="btn btn-primary">Submit</Button>
        </Form>
      </div>
    );
  }
}

export default App;
