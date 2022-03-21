import {Navbar, Container, Nav, NavDropdown, Form, FormControl, Button} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../Context/CurrentUserContext';
import CurrentUser from '../UsersList/CurrentUser';

export const Menu = () =>
{
	const navigate = useNavigate();
    const { userLoading, user, refetchUser } = useUser();
	return (
		<Navbar bg="dark" variant="dark" expand="lg">
            <Container>
                <Nav className="me-auto">
                    <Nav.Link eventKey="main" onClick={() => navigate("/")}>Dodaj wklejkę</Nav.Link>
                    <Nav.Link eventKey="pastes" onClick={() => navigate("/pastes")}>Wklejki</Nav.Link>
                    {(user?.isStaff) ? <Nav.Link eventKey="users" onClick={() => navigate("/users")}>Użytkownicy</Nav.Link> : null}
                    {user ? <Nav.Link eventKey="profile" onClick={() => navigate("/profile")}>Mój profil</Nav.Link> : null}
                </Nav>
                {user ? <CurrentUser /> :<button className='btn btn-outline-light' onClick={() => navigate("/login")}>Zaloguj!</button>}
            </Container>
        </Navbar>
	);
};

export default Menu;