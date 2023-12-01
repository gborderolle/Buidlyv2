import { CAlert } from "@coreui/react";

const FooterAlert = ({ isValid, isSuccess, successMsg, errorMsg }) => {
  return (
    <>
      {!isValid && (
        <CAlert color="danger" className="w-100">
          {errorMsg}
        </CAlert>
      )}
      {isSuccess && (
        <CAlert color="success" className="w-100">
          {successMsg}
        </CAlert>
      )}
    </>
  );
};

export default FooterAlert;
