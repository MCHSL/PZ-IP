import { useState } from "react";
import { Button } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { getReportedPastesPaginated } from "../../Queries/PaginatingQuery";
import PaginatingList from "../List/PaginatingList";
import { withStaff } from "../Misc/LoginRequired";

interface PasteReport {
  id: number;
  title: string;
  reportCount: number;
  clicked: (id: number) => void;
}

const ReportRow = ({ id, title, reportCount, clicked }: PasteReport) => {
  return (
    <tr>
      <td>
        <Button variant="link" onClick={() => clicked(id)}>
          {title}
        </Button>
      </td>
      <td className="align-middle">{reportCount}</td>
    </tr>
  );
};

const ReportedPastes = () => {
  const [page, setPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const navigate = useNavigate();
  const location = useLocation();

  const { data } = getReportedPastesPaginated(page, itemsPerPage, {
    pollInterval: 30000,
  });

  function paste_clicked(id: number) {
    navigate(`/paste/${id}`, {
      state: { returnTo: location.pathname, page, itemsPerPage },
    });
  }

  return (
    <div className="container">
      <PaginatingList
        visible={data}
        totalItems={data?.count}
        page={page}
        setPage={setPage}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
      >
        <h2 className="text-center p-2 mt-4">Wklejki wymagające uwagi</h2>
        <table className="table table-sm table-striped mt-3">
          <thead>
            <tr>
              <th>Tytuł</th>
              <th>Liczba raportów</th>
            </tr>
          </thead>
          <tbody>
            {data?.unreviewedPastes
              .slice(0, itemsPerPage)
              .sort(
                (a: PasteReport, b: PasteReport) =>
                  a.reportCount < b.reportCount
              )
              .map((report: PasteReport) => (
                <ReportRow
                  key={report.id}
                  {...report}
                  clicked={paste_clicked}
                />
              ))}
          </tbody>
        </table>
      </PaginatingList>
    </div>
  );
};

export default withStaff(ReportedPastes);
