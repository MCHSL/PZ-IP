import { useQuery } from "@apollo/client";
import { Navbar, Container, Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { get_unreviewed_reports_count } from "../../Queries/queries";
import { useUser } from "../Context/CurrentUserContext";
import CurrentUser from "../UsersList/CurrentUser";

interface Props {
  has_user: boolean;
}

export const Menu = ({ has_user }: Props) => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { data: reports } = useQuery(get_unreviewed_reports_count);
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Nav className="me-auto">
          <Nav.Link eventKey="main" onClick={() => navigate("/")}>
            Dodaj wklejkę
          </Nav.Link>
          <Nav.Link eventKey="pastes" onClick={() => navigate("/pastes")}>
            Wklejki
          </Nav.Link>
          {user?.isStaff ? (
            <>
              <Nav.Link eventKey="users" onClick={() => navigate("/users")}>
                Użytkownicy
              </Nav.Link>
              <Nav.Link eventKey="reports" onClick={() => navigate("/reports")}>
                Raporty{" "}
                {reports?.count ? (
                  <span className="bg-danger border border-danger rounded text-white p-1">
                    {reports.count}
                  </span>
                ) : null}
              </Nav.Link>
            </>
          ) : null}
          {user ? (
            <Nav.Link eventKey="profile" onClick={() => navigate("/profile")}>
              Mój profil
            </Nav.Link>
          ) : null}
        </Nav>
        {has_user ? <CurrentUser /> : null}
      </Container>
    </Navbar>
  );
};

Menu.defaultProps = {
  has_user: true,
};

export const MenuNoUser = () => {
  return <Menu has_user={false} />;
};

export default Menu;
