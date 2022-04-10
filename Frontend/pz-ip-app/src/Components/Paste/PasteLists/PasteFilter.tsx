import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Button, Collapse, Form, Row, Col, Spinner } from "react-bootstrap";

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

interface Props {
  loading: boolean;
  onSearch: (options: PasteFilterOptions) => void;
}

export const PasteFilter = ({ loading, onSearch }: Props) => {
  const [showSearch, setShowSearch] = useState(false);
  const [displayedSearchOptions, setDisplayedSearchOptions] =
    useState<PasteFilterOptions>({});

  return (
    <>
      <Button onClick={() => setShowSearch(!showSearch)}>
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
                    console.log(e.target.value);
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
                    console.log(e.target.value);
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
                    console.log(e.target.value);
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
                    console.log(e.target.value);
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
                    console.log(e.target.value);
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
                    console.log(e.target.value);
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
            <Form.Group>
              <Button
                style={{ float: "right" }}
                onClick={() => onSearch(displayedSearchOptions)}
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
