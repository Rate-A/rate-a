import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';

export function App() {
  return (
    <>
      <style jsx>{``}</style>

      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand>
            <span role="img" aria-label="Cat Girl Love">
              😻
            </span>
            Lost Ark Cat Girls
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Item>
                <Nav.Link as={Link} to="/">
                  Home
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link as={Link} to="/upload">
                  New Post
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Route path="/" exact render={() => <HomePage />} />

      <Route path="/upload" exact strict render={() => <CreateCatGirlPage />} />

      <Route
        path="/cat-girls/:catGirlId"
        exact
        render={() => <CatGirlPage />}
      />
    </>
  );
}

const HomePage = () => <Container>TODO: HOME PAGE</Container>;

const API_BASE =
  'https://qg5rlnnw8b.execute-api.ca-central-1.amazonaws.com/prod/';
const CAT_GIRLS_BASE = `${API_BASE}cat-girls`;

interface CatGirl {
  readonly catGirlId: string;
  readonly hotCount: number;
  readonly notHotCount: number;
  readonly hornyJailCount: number;
}

const CreateCatGirlPage = () => {
  const [catGirl, setCatGirl] = useState<CatGirl>();

  useEffect(() => {
    void iife();

    async function iife() {
      const res = await fetch(CAT_GIRLS_BASE, { method: 'PUT' });
      const resJson = await res.json();
      setCatGirl(resJson.catGirl);
    }
  }, [setCatGirl]);

  if (!catGirl) {
    return <Container>CREATING CAT GIRL</Container>;
  }

  return (
    <Container>
      TODO: Image upload
      <br />
      <Link to={`/cat-girls/${catGirl.catGirlId}`}>View Cat Girl</Link>
      <br />
      {JSON.stringify(catGirl)}
    </Container>
  );
};

const CatGirlPage = () => {
  const params = useParams<{ catGirlId: string }>();
  const [catGirl, setCatGirl] = useState<CatGirl>();

  useEffect(() => {
    void iife();

    async function iife() {
      const res = await fetch(`${CAT_GIRLS_BASE}/${params.catGirlId}`);
      const resJson = await res.json();
      setCatGirl(resJson.catGirl);
    }
  }, [setCatGirl, params]);

  async function vote(vote: string) {
    const res = await fetch(`${CAT_GIRLS_BASE}/${params.catGirlId}/vote`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        vote,
        dedupId: Math.round(Math.random() * 999_999_999_999_999).toString(),
      }),
    });

    const resJson = await res.json();
    setCatGirl(resJson.catGirl);
  }

  function onHotClick() {
    void vote('HOT');
  }
  function onNotHotClick() {
    void vote('NOT_HOT');
  }
  function onHornyJailClick() {
    void vote('HORNY_JAIL');
  }

  if (!catGirl) {
    return <Container>Finding Cat Girl</Container>;
  }

  return (
    <Container>
      CAT GIRL PAGE
      <br />
      <br />
      TODO: SHOW CAT GIRL
      <br />
      <br />
      <Button onClick={onHotClick}>
        <span role="img" aria-label="Hot">
          🔥
        </span>{' '}
        Hot&nbsp;&nbsp;&nbsp;&nbsp;
        <Badge bg="white" text="dark">
          {catGirl.hotCount}
        </Badge>
      </Button>{' '}
      <Button onClick={onNotHotClick}>
        <span role="img" aria-label="Not Hot">
          💩
        </span>{' '}
        Not Hot&nbsp;&nbsp;&nbsp;&nbsp;
        <Badge bg="white" text="dark">
          {catGirl.notHotCount}
        </Badge>
      </Button>{' '}
      <Button onClick={onHornyJailClick}>
        <span role="img" aria-label="Horny Jail">
          🗿
        </span>
        Horny Jail&nbsp;&nbsp;&nbsp;&nbsp;
        <Badge bg="white" text="dark">
          {catGirl.hornyJailCount}
        </Badge>
      </Button>
      <br />
      <br />
      {JSON.stringify(catGirl)}
    </Container>
  );
};

export default App;
