import { Form } from "react-bootstrap";
import { usePaste } from "../../Context/CurrentPasteContext";
import { Report } from "../Types";
import ReportRow from "./ReportRow";

const Reports = () => {
  const { paste } = usePaste();

  if (!paste || paste.reports.length === 0) {
    return null;
  }
  return (
    <Form.Group className="mb-3">
      <Form.Label>Raporty</Form.Label>
      <table className="table table-striped">
        <thead>
          <tr>
            <th className="text-muted col col-lg-10">Powód</th>
            <th className="text-muted col col-md-2">Utworzono</th>
            <th className="text-muted col col-sm-auto"></th>
          </tr>
        </thead>
        <tbody>
          {paste.reports.map((report) => (
            <ReportRow key={report.id} report={report} />
          ))}
        </tbody>
      </table>
    </Form.Group>
  );
};

export default Reports;
