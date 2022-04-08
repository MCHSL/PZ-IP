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
          {props.pastes.length === 0 && (
            <tr>
              <td colSpan={7} className="text-center text-muted">
                Nic tu nie ma!
              </td>
            </tr>
          )}
          {props.pastes?.map((paste) => {
            return (
              <PasteRow
                key={paste.id.toString()}
                paste={paste}
                refetch={props.refetch}
                page={props.page}
                itemsPerPage={props.itemsPerPage}
              />
            );
          })}
          {props.itemsPerPage > props.pastes.length &&
            [...Array(props.itemsPerPage - props.pastes.length)].map((_, i) => {
              return (
                <PasteRow
                  key={(-i).toString()}
                  refetch={props.refetch}
                  page={props.page}
                  itemsPerPage={props.itemsPerPage}
                />
              );
            })}
        </tbody>
      </Table>
    </PaginatingList>
  );
};

export default PasteList;
