import { useLocation, Navigate } from "react-router-dom";
import { useUser } from "../Context/CurrentUserContext";

export const RedirectToLogin = () => {
  const location = useLocation();
  return <Navigate to="/login" state={{ returnTo: location.pathname }} />;
};

export const withLogin = (Component: any) => {
  return (props: any) => {
    const { userLoading, user } = useUser();
    if (userLoading) {
      return <Component {...props} />;
    }

    if (!user) {
      return <RedirectToLogin />;
    }

    return <Component {...props} />;
  };
};

export const withStaff = (Component: any) => {
  return withLogin((props: any) => {
    const { user } = useUser();

    if (user && !user.isStaff) {
      return (
        <div
          style={{
            width: "100%",
            height: "100%",
            textAlign: "center",
            marginTop: "50px",
          }}
        >
          <h1>Nie masz uprawnień do tej części serwisu</h1>
        </div>
      );
    }

    return <Component {...props} />;
  });
};

export default withLogin;
