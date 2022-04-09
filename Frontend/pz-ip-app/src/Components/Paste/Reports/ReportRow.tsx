import { Report } from "../Types";
import { DateTime } from "luxon";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import { Button } from "react-bootstrap";
import {
  get_paste,
  get_unreviewed_reports,
  get_unreviewed_reports_count,
  delete_report,
} from "../../../Queries/queries";
import { useMutation } from "@apollo/client";

interface Props {
  report: Report;
  refetch: () => Promise<any>;
}

const ReportRow = ({ report, refetch }: Props) => {
  const [doDeleteReport] = useMutation(delete_report, {
    refetchQueries: [
      get_paste,
      "GetUnreviewedReports", // Somehow this only works when passed as string and not as the actual query
      get_unreviewed_reports_count,
    ],
  });

  function onDeleteButtonClicked() {
    doDeleteReport({
      variables: {
        id: report.id,
      },
    });
  }

  const formattedDateReported = DateTime.fromJSDate(
    new Date(report.createdAt)
  ).toFormat("yyyy-MM-dd HH:mm");

  return (
    <tr>
      <td>{report.reason}</td>
      <td>{formattedDateReported}</td>
      <td>
        {
          <Button
            style={{ padding: "3px", lineHeight: "0px" }}
            variant="success"
            onClick={onDeleteButtonClicked}
          >
            <FontAwesomeIcon icon={solid("check")} />
          </Button>
        }
      </td>
    </tr>
  );
};

export default ReportRow;
