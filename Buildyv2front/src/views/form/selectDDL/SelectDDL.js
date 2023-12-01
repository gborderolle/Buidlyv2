import React, { useState, useEffect } from "react";
import {
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CRow,
  CCol,
} from "@coreui/react";

// redux imports
import { useSelector } from "react-redux";

const SelectDDL = (props) => {
  //#region Const ***********************************

  const [selectedItem, setSelectedItem] = useState(
    useSelector((state) => state.liveSettings.circuit)
  );

  //#endregion Const ***********************************

  //#region Events ***********************************

  const handleSelect = (item) => {
    setSelectedItem(item);
    props.onSelect(item); // Notifica al componente padre
  };

  //#endregion Events ***********************************

  const ddlStyle = props.isMobile
    ? {
        margin: "auto",
        marginTop: "5px",
      }
    : {};

  const ddlTextStyle = props.isMobile
    ? {
        color: "whitesmoke",
      }
    : {};
  return (
    <>
      <CRow
        // className="mb-2"
        style={{
          display: "-webkit-inline-box",
          flex: "flex-wrap",
        }}
      >
        <CCol>
          <CDropdown style={ddlStyle}>
            <CDropdownToggle
              id="selectedItem"
              color={props.isMobile ? "inherit" : "secondary"}
              size="sm"
              style={ddlTextStyle}
            >
              {selectedItem
                ? selectedItem[props.keyNumber] +
                  ": " +
                  selectedItem[props.keyName]
                : props.label}
            </CDropdownToggle>
            <CDropdownMenu>
              {props.items &&
                props.items.map((item, index) => (
                  <CDropdownItem
                    key={index}
                    onClick={() => handleSelect(item)}
                    style={{ cursor: "pointer" }}
                  >
                    {item[props.keyNumber] + ": " + item[props.keyName]}
                  </CDropdownItem>
                ))}
            </CDropdownMenu>
          </CDropdown>
        </CCol>
      </CRow>
    </>
  );
};

export default SelectDDL;
