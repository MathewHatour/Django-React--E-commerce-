import axios from "axios";

/*
  DummyJSON API
  - READ ONLY
  - Used for UI simulation only
*/

const dummyAPI = axios.create({
  baseURL: "https://dummyjson.com",
});

export default dummyAPI;
