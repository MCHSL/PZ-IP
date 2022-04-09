import { Form } from "react-bootstrap";
import { Report } from "../Types";
import ReportRow from "./ReportRow";

interface Props {
  reports: Report[];
  refetch: () => Promise<any>;
}

const Reports = ({ reports, refetch }: Props) => {
  if (reports.length === 0) {
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
          {reports.map((report) => (
            <ReportRow key={report.id} report={report} refetch={refetch} />
          ))}
        </tbody>
      </table>
    </Form.Group>
  );
};

export default Reports;
