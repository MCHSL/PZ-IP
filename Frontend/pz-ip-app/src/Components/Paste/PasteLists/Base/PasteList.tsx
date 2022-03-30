import { Table } from "react-bootstrap";
import PasteRow from "./PasteRow";
import PaginatingList from "../../../List/PaginatingList";
import { PasteInfo } from "../../Types";

interface Props {
  pastes: PasteInfo[];
  totalItems: number;
  page: number;
  itemsPerPage: number;
  setPage: (page: number) => void;
  setItemsPerPage: (itemsPerPage: number) => void;
  refetch: () => {};
}

const PasteList = (props: Props) => {
  //let message = null;
  /*if (loading && !previousData)
	{
		message =
			(<div>
				<h1>Ładowanie...</h1>
			</div>)
	}
	else if (error)
	{
		console.log("errored")
		message =
			(<div>
				<h1>Wystąpił błąd podczas ładowania.</h1>
				<span className={"text-muted"}><span>Nowa próba za</span><Countdown date={Date.now() + 5000} onComplete={reloading} renderer={props => { return <>{props.seconds}</> }} />...</span>
			</div>)
	}*/

  return (
    <PaginatingList visible={props.pastes.length > 0} {...props}>
      <Table striped hover size="sm">
        <thead>
          <tr>
            <th className="text-muted col-2">Tytuł</th>
            <th className="text-muted col-2">Utworzona</th>
            <th className="text-muted col-2">Zmieniona</th>
            <th className="text-muted col-1">Autor</th>
            <th className="text-muted col-1">Lajki</th>
            <th className="text-muted col-1 text-center">Prywatna</th>
            <th className="text-muted col-1"></th>
          </tr>
        </thead>
        <tbody>
          {props.pastes?.map((paste) => {
            return (
              <PasteRow
                key={paste.id.toString()}
                paste={paste}
                refetch={props.refetch}
              />
            );
          })}
        </tbody>
      </Table>
    </PaginatingList>
  );
};

export default PasteList;
