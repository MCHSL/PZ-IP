//import Pagination from '@vlsergey/react-bootstrap-pagination';

import React, { createRef, useState } from "react";
import { Dropdown, DropdownButton, Pagination } from "react-bootstrap";

interface Props {
  visible: boolean;
  totalItems: number;
  page: number;
  setPage: (page: number) => void;
  itemsPerPage: number;
  setItemsPerPage: (itemsPerPage: number) => void;
  children: any;
}

const PaginatingList = ({
  children,
  visible,
  totalItems,
  page,
  setPage,
  itemsPerPage,
  setItemsPerPage,
}: Props) => {
  const [editingPage, setEditingPage] = useState(false);
  const pageInputRef = createRef<HTMLInputElement>();
  const last_page = Math.ceil(totalItems / itemsPerPage);

  function selectPage() {
    const val = pageInputRef.current?.value;
    const new_page = val ? Number(val) - 1 : page;
    if (new_page >= 0 && new_page < last_page) {
      console.log("bruhh", new_page, last_page);
      setPage(new_page);
    }
    setEditingPage(false);
  }

  function setItemsPerPageProxy(newItemsPerPage: number) {
    setItemsPerPage(newItemsPerPage);
    setPage(Math.floor((page * itemsPerPage) / newItemsPerPage));
  }

  if (!visible) {
    return <>{children}</>;
  }

  return (
    <>
      {children}
      <div style={{ margin: "auto" }}>
        <Pagination style={{ margin: "auto", justifyContent: "center" }}>
          <Pagination.First disabled={page === 0} onClick={() => setPage(0)} />
          <Pagination.Prev
            disabled={page === 0}
            onClick={() => setPage(page - 1)}
          />

          {editingPage ? (
            <Pagination.Item>
              <span>
                <input
                  autoFocus
                  ref={pageInputRef}
                  onKeyUp={(e) => {
                    return e.key === "Enter" ? selectPage() : null;
                  }}
                  onBlur={selectPage}
                  type="text"
                  placeholder={(page + 1).toString()}
                  style={{
                    zIndex: 1000,
                    display: "inline",
                    height: "1.5em",
                    width: "5em",
                    textAlign: "right",
                    border: "1px solid whitesmoke",
                  }}
                />
              </span>
              <span>{"/" + last_page}</span>
            </Pagination.Item>
          ) : (
            <Pagination.Item
              style={{ whiteSpace: "pre-wrap" }}
              onClick={() => setEditingPage(true)}
            >
              {(page + 1)
                .toString()
                .padStart(
                  last_page.toString().length - (page + 1).toString().length,
                  " "
                ) +
                " / " +
                last_page}
            </Pagination.Item>
          )}

          <Pagination.Next
            disabled={page === last_page - 1}
            onClick={() => setPage(page + 1)}
          />
          <Pagination.Last
            disabled={page === last_page - 1}
            onClick={() => setPage(last_page - 1)}
          />
        </Pagination>
        <DropdownButton
          style={{
            display: "flex",
            width: "50%",
            justifyContent: "center",
            margin: "auto",
            marginTop: "10px",
            marginBottom: "10px",
          }}
          title={`${itemsPerPage} na stronę`}
          onSelect={(e) => setItemsPerPageProxy(Number(e))}
        >
          {[5, 10, 15, 25, 50, 100].map((num) => {
            return (
              <Dropdown.Item
                key={num}
                eventKey={num}
                active={num === itemsPerPage}
              >
                {num}
              </Dropdown.Item>
            );
          })}
        </DropdownButton>
      </div>
    </>
  );
};

export default PaginatingList;
