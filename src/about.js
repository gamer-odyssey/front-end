import React from 'react';
import Carousel from 'react-bootstrap/Carousel';
import Card from 'react-bootstrap/Card';
import './About.css';

class About extends React.Component {
  render() {
    
    return (
      <div class="about-page">
        <h1>About the Gaming Odyssey Team</h1>
        <Carousel>
          <Carousel.Item>
            <Card.Body>
              <img
                className="bio-image"
                src="/img/ayrat.jpg"
                alt="First Slide Profile"
              />
              <Card.Text>
                <h3>Ayrat Gimranov</h3>
                <p className="bio-p">Hi, my name is Ayrat Gimranov and I am a software developer. I moved to the US as a college student to pursue a career in healthcare. Most recently I worked as RN at UW Medical Center's cardiac surgery and advanced heart failure unit. I became attracted to project-type work and decided to make a career change into tech where I could use previously gained skills such as critical thinking, ability to function under stress, prioritizing and delegation. My Motto is: "We can change the world"!</p>
              </Card.Text>
              <a href="https://github.com/ag961">
                <img class="github" src="img/github-mark.png" alt="Link" onClick="" />
              </a>
              <a href="https://www.linkedin.com/in/ayrat-gimranov/">
                <img class="linkedin" src="img/linkedin.png" alt="Link" onClick="" />
              </a>
            </Card.Body>
          </Carousel.Item>
          <Carousel.Item>
            <Card.Body>
              <img
                className="bio-image"
                src="/img/alex.jpg"
                alt="Second Slide Profile"
              />
              <Card.Text>
                <h3>Alex Payne</h3>
                <p className="bio-p">Hi my name's Alex i'm an upcoming Python Software Dev. Before codefellow I worked at Apple, OfferUp, and even on a presidential campaign. I'm super interested in software development because anyone can really do this with the right tools and training you can literally build something as cool as google....(Lots more time needed for that).
                  I'm focusing on Python development because of how interested I am in machine learning its just so cool having a machine learn its something out of a movie and something I can talk about all day. I'd really love to work as a Machine learning engineer at pretty much any company but google or nasa would be my dream places.
                  Before deciding to work in the dev world I came from the IT and Ops side of the Tech world so I have you covered if you need help setting up your WiFi. My background working for Apple has give me a great attention for detail (Apple plans literally every cm most projects they work on) and a fantastic ability to work with all types of folks.</p>
              </Card.Text>
              <a href="https://github.com/DrPayne25">
                <img class="github" src="img/github-mark.png" alt="Link" />
              </a>
              <a href="https://www.linkedin.com/in/alexenderpayneofficial/">
                <img class="linkedin" src="img/linkedin.png" alt="Link" />
              </a>
            </Card.Body>
          </Carousel.Item>
          <Carousel.Item>
            <Card.Body>
              <img
                className="bio-image"
                src="/img/connor.jpg"
                alt="Third Slide Profile"
              />
              <Card.Text>
                <h3>Connor Boyce</h3>
                <p className="bio-p" >Hello, Thanks for visiting our site! My name is Connor Boyce, I am a Software Developer with a background in IT support. Currently I am in pursuit of following a passion of mine, which you may have figured is a career in tech! My dream jobs would be working for some innovative teams like Apple, Google, Facebook, or Tesla. I love my friends and family and I have a huge desire to learn new things. If you're into sports, video games, or hiphop music then I can chat your ear off. If you would like to connect please contact me through these linke on the page! Hope you enjoy our site and have a great rest of your day!</p>
              </Card.Text>
              <a href="https://github.com/royce79-creator">
                <img class="github" src="img/github-mark.png" alt="Link" />
              </a>
              <a href="https://www.linkedin.com/in/connor-boyce/">
                <img class="linkedin" src="img/linkedin.png" alt="Link" />
              </a>
            </Card.Body>
          </Carousel.Item>
        </Carousel>
      </div>
    )
  }
}

export default About;
