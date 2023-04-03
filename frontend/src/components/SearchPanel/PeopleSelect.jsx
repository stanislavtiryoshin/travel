import React, { useEffect } from "react";

const PeopleSelect = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="search_col" onClick={() => setIsOpen(!isOpen)}>
      <img src={search4} alt="" className="search_bot-icon" />
      <div className="search_col-content">
        <div className="search_col-top">Кто?</div>
        <div className="search_col-bot">
          <input
            type="number"
            placeholder="1"
            name="number"
            value={searchTerms.number}
            onChange={(e) => {
              setSearchTerms({ ...searchTerms, number: e.target.value });
              // changeAmount(e.target.value);
              setClientData({
                ...clientData,
                peopleAmount: e.target.value,
              });
              dispatch(setPeopleAmount(e.target.value));
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default PeopleSelect;
