import "./App.css"; // Importing the main CSS file for styling
import {
  FormControl,    // For input fields
  InputGroup,     // For grouping input and button
  Container,      // For responsive layout
  Button,         // For clickable buttons
  Card,           // For displaying album information
  Row,            // For arranging albums in a grid
  Col,            // Added Col
} from "react-bootstrap"; // Importing components from react-bootstrap for UI design
import { useState, useEffect } from "react"; // Importing React hooks for state and side effects
import React from "react";
// Import the Footer component
import Footer from "./components/footer";

// Retrieving Spotify API credentials from environment variables
const clientId = import.meta.env.VITE_CLIENT_ID;
const clientSecret = import.meta.env.VITE_CLIENT_SECRET;

// Main App component
function App() {
  // State to store the user's search input (artist name)
  const [searchInput, setSearchInput] = useState("");
  // State to store the access token obtained from Spotify API
  const [accessToken, setAccessToken] = useState("");
  // State to store the list of albums retrieved for the artist
  const [albums, setAlbums] = useState([]);

  // useEffect hook runs once when the component mounts to fetch the access token
  useEffect(() => {
    // Parameters for the POST request to obtain the access token
    let authParams = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded", // Specifying the content type
      },
      body:
        "grant_type=client_credentials&client_id=" +
        clientId +
        "&client_secret=" +
        clientSecret, // Body contains the grant type and credentials
    };

    // Fetching the access token from Spotify Accounts service
    fetch("https://accounts.spotify.com/api/token", authParams)
      .then((result) => result.json()) // Parsing the response as JSON
      .then((data) => {
        setAccessToken(data.access_token); // Storing the access token in state
      });
  }, []); // Empty dependency array ensures this runs only once

  // Asynchronous function to search for artist and retrieve their albums
  async function search() {
    // Parameters for GET requests to Spotify API
    let artistParams = {
      method: "GET",
      headers: {
        "Content-Type": "application/json", // Specifying the content type
        Authorization: "Bearer " + accessToken, // Authorization header with Bearer token
      },
    };

    try {
      // Fetching artist information based on the search input
      const artistID = await fetch(
        "https://api.spotify.com/v1/search?q=" + encodeURIComponent(searchInput) + "&type=artist",
        artistParams
      )
        .then((result) => result.json()) // Parsing the response as JSON
        .then((data) => {
          // Returning the ID of the first artist in the search results
          return data.artists.items[0].id;
        });

      // Fetching albums of the artist using the artist ID
      await fetch(
        "https://api.spotify.com/v1/artists/" +
          artistID +
          "/albums?include_groups=album&market=US&limit=50",
        artistParams
      )
        .then((result) => result.json()) // Parsing the response as JSON
        .then((data) => {
          setAlbums(data.items); // Storing the retrieved albums in state
        });
    } catch (error) {
      console.error("Error fetching artist or albums:", error); // Logging any errors
    }
  }

  // Rendering the UI
  return (
    <>
      <Container>
        <h1>
          <img
            src="https://img.icons8.com/3d-fluency/94/spotify-logo.png"
            alt="Spotify Logo"
            style={{ verticalAlign: "middle", marginRight: "10px", fontFamily: "Contrail One" }}
          />
          Spotify Album Search
        </h1>
        <InputGroup>
          <FormControl
            placeholder="Search For Artist" // Placeholder text in the input field
            type="input" // Input type
            aria-label="Search for an Artist" // Accessibility label
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                search(); // Trigger search on Enter key press
              }
            }}
            onChange={(event) => setSearchInput(event.target.value)} // Updating searchInput state on change
            style={{
              width: "400px",
              height: "50px",
              borderWidth: "0px",
              borderStyle: "solid",
              borderRadius: "5px",
              fontSize: "20px",
              fontFamily: "monospace",
              marginRight: "10px",
              paddingLeft: "20px",
              marginBottom: "50px",
            }} // Inline styles for the input field
          />
          <Button onClick={search}>Search</Button> {/* Button to trigger search */}
        </InputGroup>
      </Container>

      <Container style={{ marginBottom: "80px" }}>
        <Row
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center", // Distribute space around items
            alignContent: "center",       // Vertically center items
          }} // Inline styles to arrange album cards in a responsive grid
        >
          {albums.map((album) => {
            return (

              <Card
                key={album.id} // Unique key for each album card
                style={{
                  backgroundColor: "#34bc4d",
                  margin: "15px",
                  color: "white",
                  borderRadius: "25px",
                  marginBottom: "20px",
                }} // Inline styles for the album card
              >

                <Card.Img
                  width={350} // Width of the album image
                  src={album.images[0].url} // Source URL of the album image
                  style={{
                    borderRadius: "3%",
                  }} // Inline styles for the album image
                />

                <Card.Body>

                  <Card.Title
                    style={{
                      whiteSpace: "wrap",
                      fontWeight: "bold",
                      fontSize: "20px",
                      color: "black",
                      marginTop: "10px",
                      alignItems: "left",
                    }} // Inline styles for the album title
                  >
                    {album.name} {/* Displaying the album name */}
                  </Card.Title>
                 
                  <Card.Text
                    style={{
                      color: "black",
                      fontSize: "18px",
                      alignItems: "left",
                      alignContent: "left",
                    }} // Inline styles for the release date text
                  >
                    Release Date: <br /> {album.release_date} {/* Displaying the release date */}
                  </Card.Text>

                  <Button
                    href={album.external_urls.spotify} // Link to the album on Spotify
                    style={{
                      backgroundColor: "black",
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "15px",
                      borderRadius: "5px",
                      padding: "10px",
                    }} // Inline styles for the Album Link button
                  >
                    Listen Now {/* Text for the button */}
                  </Button>
                </Card.Body>
              </Card>
            );
          })}
        </Row>
      </Container>
      <Footer></Footer>
    </>
  );
}

export default App; // Exporting the App component as the default export
