import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import {
  Button,
  Collapse,
  Form,
  Row,
  Col,
  Spinner,
  Dropdown,
} from "react-bootstrap";

interface PasteFilterOptions {
  titleContains?: string;
  contentContains?: string;
  created?: {
    before?: string;
    after?: string;
  };
  edited?: {
    before?: string;
    after?: string;
  };
  likeCount?: {
    moreThan?: number;
    lessThan?: number;
  };
}

interface PasteOrdering {
  field: "CREATED_AT" | "UPDATED_AT" | "LIKE_COUNT";
  direction: "ASC" | "DESC";
}

interface PasteDisplayOptions {
  filters?: PasteFilterOptions;
  orderBy?: PasteOrdering;
}

const field_names: { [name: string]: string } = {
  CREATED_AT: "Utworzono",
  UPDATED_AT: "Zmodyfikowano",
  LIKE_COUNT: "Lajki",
};

interface Props {
  loading: boolean;
  onSearch: (options: PasteDisplayOptions) => void;
}

export const PasteFilter = ({ loading, onSearch }: Props) => {
  const [showSearch, setShowSearch] = useState(false);
  const [displayedSearchOptions, setDisplayedSearchOptions] =
    useState<PasteFilterOptions>({});
  const [ordering, setOrdering] = useState<PasteOrdering>({
    field: "CREATED_AT",
    direction: "DESC",
  });

  return (
    <>
      <Button
        style={{ width: "100%" }}
        onClick={() => setShowSearch(!showSearch)}
      >
        Wyszukiwanie{" "}
        <FontAwesomeIcon
          style={{ marginLeft: "5px" }}
          icon={showSearch ? solid("caret-up") : solid("caret-down")}
        />
      </Button>
      <Collapse in={showSearch}>
        <div>
          <Form className="p-1">
            <Form.Group className="mb-3">
              <Form.Label>Tytuł zawiera: </Form.Label>
              <Form.Control
                type="text"
                key="bruh"
                placeholder="Ciąg znaków..."
                value={displayedSearchOptions.titleContains || ""}
                onChange={(e) =>
                  setDisplayedSearchOptions({
                    ...displayedSearchOptions,
                    titleContains: e.target.value || undefined,
                  })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Treść zawiera: </Form.Label>
              <Form.Control
                type="text"
                placeholder="Ciąg znaków..."
                value={displayedSearchOptions.contentContains || ""}
                onChange={(e) =>
                  setDisplayedSearchOptions({
                    ...displayedSearchOptions,
                    contentContains: e.target.value || undefined,
                  })
                }
              />
            </Form.Group>
            <Row className="mb-3">
              <Form.Group as={Col}>
                <Form.Label>Dodana przed </Form.Label>
                <Form.Control
                  type="date"
                  value={displayedSearchOptions.created?.before || ""}
                  onChange={(e) => {
                    setDisplayedSearchOptions({
                      ...displayedSearchOptions,
                      created: {
                        ...displayedSearchOptions.created,
                        before: e.target.value || undefined,
                      },
                    });
                  }}
                />
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>Dodana po </Form.Label>
                <Form.Control
                  type="date"
                  value={displayedSearchOptions.created?.after || ""}
                  onChange={(e) => {
                    setDisplayedSearchOptions({
                      ...displayedSearchOptions,
                      created: {
                        ...displayedSearchOptions.created,
                        after: e.target.value || undefined,
                      },
                    });
                  }}
                />
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col}>
                <Form.Label>Zmieniona przed </Form.Label>
                <Form.Control
                  type="date"
                  value={displayedSearchOptions.edited?.before || ""}
                  onChange={(e) => {
                    setDisplayedSearchOptions({
                      ...displayedSearchOptions,
                      edited: {
                        ...displayedSearchOptions.edited,
                        before: e.target.value || undefined,
                      },
                    });
                  }}
                />
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>Zmieniona po </Form.Label>
                <Form.Control
                  type="date"
                  value={displayedSearchOptions.edited?.after || ""}
                  onChange={(e) => {
                    setDisplayedSearchOptions({
                      ...displayedSearchOptions,
                      edited: {
                        ...displayedSearchOptions.edited,
                        after: e.target.value || undefined,
                      },
                    });
                  }}
                />
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col}>
                <Form.Label>Lajków więcej niż </Form.Label>
                <Form.Control
                  type="number"
                  value={displayedSearchOptions.likeCount?.moreThan ?? ""}
                  onChange={(e) => {
                    setDisplayedSearchOptions({
                      ...displayedSearchOptions,
                      likeCount: {
                        ...displayedSearchOptions.likeCount,
                        moreThan:
                          e.target.value === ""
                            ? undefined
                            : Number(e.target.value),
                      },
                    });
                  }}
                />
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>Lajków mniej niż </Form.Label>
                <Form.Control
                  type="number"
                  value={displayedSearchOptions.likeCount?.lessThan ?? ""}
                  onChange={(e) => {
                    setDisplayedSearchOptions({
                      ...displayedSearchOptions,
                      likeCount: {
                        ...displayedSearchOptions.likeCount,
                        lessThan:
                          e.target.value === ""
                            ? undefined
                            : Number(e.target.value),
                      },
                    });
                  }}
                />
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col}>
                <Form.Label>Sortowanie według </Form.Label>
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    alignItems: "baseline",
                  }}
                >
                  <Dropdown>
                    <Dropdown.Toggle
                      variant="primary"
                      style={{ verticalAlign: "baseline" }}
                    >
                      {ordering?.field
                        ? field_names[ordering.field]
                        : "Wybierz..."}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item
                        onClick={() =>
                          setOrdering({
                            ...ordering,
                            field: "CREATED_AT",
                          })
                        }
                      >
                        Utworzono
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() =>
                          setOrdering({
                            ...ordering,
                            field: "UPDATED_AT",
                          })
                        }
                      >
                        Zmodyfikowano
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() =>
                          setOrdering({
                            ...ordering,
                            field: "LIKE_COUNT",
                          })
                        }
                      >
                        Lajki
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                  <div>
                    <Form.Check
                      inline
                      label="Rosnąco"
                      name="asc-desc"
                      type="radio"
                      checked={ordering.direction === "ASC"}
                      onChange={() =>
                        setOrdering({ ...ordering, direction: "ASC" })
                      }
                    />
                    <Form.Check
                      inline
                      label="Malejąco"
                      name="asc-desc"
                      type="radio"
                      checked={ordering.direction === "DESC"}
                      onChange={() =>
                        setOrdering({ ...ordering, direction: "DESC" })
                      }
                    />
                  </div>
                  {/* <ToggleButtonGroup
                    type="radio"
                    name="AAAAAAAAAAAAAAA"
                    value={ordering.direction}
                    onChange={(direction: "ASC" | "DESC") =>
                      setOrdering({ ...ordering, direction })
                    }
                  >
                    <ToggleButton value="ASC">Rosnąco</ToggleButton>
                    <ToggleButton value="DESC">Malejąco</ToggleButton>
                  </ToggleButtonGroup> */}
                </div>
              </Form.Group>
            </Row>
            <Form.Group>
              <Button
                style={{ float: "right" }}
                onClick={() =>
                  onSearch({
                    filters: displayedSearchOptions,
                    orderBy: ordering,
                  })
                }
              >
                Szukaj{" "}
                {loading ? (
                  <Spinner
                    style={{ marginLeft: "5px" }}
                    animation="border"
                    size="sm"
                  />
                ) : (
                  <FontAwesomeIcon
                    style={{ marginLeft: "5px" }}
                    icon={solid("search")}
                  />
                )}
              </Button>
            </Form.Group>
          </Form>
        </div>
      </Collapse>
    </>
  );
};

export default PasteFilter;
