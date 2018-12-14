/**
 * Create a new file in order to separate concerns and make the code more testable
 * Also, each function should do one thing only in order to be more easy to test it
 *  */
const domain = "http://localhost:8080/";

/**
 * fetch can fail due to many reasons slow internet connection; the service is unreacheable
 * that is why a try catch is necessary
 * I am very keen to include only statements that are  subject for throwing exceptions in any try/catch
 * but especially in JS, because when having a callback for example, the scope is changed and no outter try catch will catch throwed in that scope
 */

class Butler {
  async loadCountries() {
    let content = [];
    const myURL = new URL("/countries", domain);
    try {
      const response = await fetch(myURL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });
      content = await response.json();
    } catch (Exception) {
      console.log("Could not fetch countries", JSON.stringify(Exception));
    }

    return content;
  }


  async loadCities(country) {
    let content = [];
    let method = "cities";
    const myURL = new URL(domain + method + "?country=" + country);
    try {
      const response = await fetch(myURL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });
      content = await response.json();
    } catch (Exception) {
      console.log("Could not fetch cities", JSON.stringify(Exception));
    }

    return content;
  }

  async addUser(params) {
    let content = [];
    let method = "users";
    const myURL = new URL(domain + method);
    try {
      const response = await fetch(myURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(params)
      });
      content = await response.json();
    } catch (Exception) {
      console.log("Could not add user", JSON.stringify(Exception));
    }

    return content;
  }


}

/**
 * Freeze the Object in order to be sure that it will not be altered
 */
export default Object.freeze(Butler);
