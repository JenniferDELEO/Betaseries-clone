import axios from "axios";
import React, { useEffect, useState } from "react";
import ShowCard from "../components/ShowCard";
import {
  countries,
  otherCountries,
  durations,
  initiales,
} from "../lib/caracteristics";
import { BiCaretRightSquare, BiRotateLeft } from "react-icons/bi";
import { FaTheaterMasks, FaSearch } from "react-icons/fa";
import {
  BsCalendarCheck,
  BsClock,
  BsFlag,
  BsCursorText,
  BsBookmark,
} from "react-icons/bs";
import { MdTimer } from "react-icons/md";
import { FiSliders, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { IoMdArrowDropdown } from "react-icons/io";
import Pagination from "../components/Pagination";

const Shows = () => {
  const [showList, setShowList] = useState([]);
  const [showResult, setShowResult] = useState([]);
  const [showResultOneOnly, setShowResultOneOnly] = useState({});
  const [showsNumber, setShowsNumber] = useState(null);
  const [showsId, setShowsId] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [genres, setGenres] = useState({});
  const [openPlatform, setOpenPlatform] = useState(false);
  const [openGenre, setOpenGenre] = useState(false);
  const [openDiffusion, setOpenDiffusion] = useState(false);
  const [openCreationDate, setOpenCreationDate] = useState(false);
  const [openCountry, setOpenCountry] = useState(false);
  const [openDurationEpisode, setOpenDurationEpisode] = useState(false);
  const [openNew, setOpenNew] = useState(false);
  const [openInitiales, setOpenInitiales] = useState(false);
  const [openSaveFilter, setOpenSaveFilter] = useState(false);
  const [openOrderFilter, setOpenOrderFilter] = useState(false);
  const [text, setText] = useState("");
  const limit = 20;
  const [currentPage, setCurrentPage] = useState(1);
  const [filterGenre, setFilterGenre] = useState([]);
  const [filterDiffusion, setFilterDiffusion] = useState([]);
  const [filterEpisodeDuration, setFilterEpisodeDuration] = useState([]);
  const [filterPlatform, setFilterPlatform] = useState([]);
  const [filterCreationDate, setFilterCreationDate] = useState([]);
  const [filterCountry, setFilterCountry] = useState([]);
  const [filterInitiale, setFilterInitiale] = useState("");
  const [filterOrder, setFilterOrder] = useState("popularite");
  const [filterFilter, setFilterFilter] = useState(["new"]);

  const openingPlatform = () => {
    setOpenPlatform(!openPlatform);
  };

  const openingGenre = () => {
    setOpenGenre(!openGenre);
  };

  const openingDiffusion = () => {
    setOpenDiffusion(!openDiffusion);
  };

  const openingCreationDate = () => {
    setOpenCreationDate(!openCreationDate);
  };

  const openingCountry = () => {
    setOpenCountry(!openCountry);
  };

  const openingDurationEpisode = () => {
    setOpenDurationEpisode(!openDurationEpisode);
  };

  const openingNew = () => {
    setOpenNew(!openNew);
  };

  const openingInitiales = () => {
    setOpenInitiales(!openInitiales);
  };

  const openingSaveFilter = () => {
    setOpenSaveFilter(!openSaveFilter);
  };

  const openingOrderFilter = () => {
    setOpenOrderFilter(!openOrderFilter);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    let config = {
      headers: {
        Authorization: "Bearer " + token,
      },
    };
    async function request() {
      await axios
        .get(
          `https://api.betaseries.com/platforms/list?key=${process.env.REACT_APP_KEY}&v=3.0`
        )
        .then((res) => res.data)
        .then((data) => {
          setPlatforms(data.platforms.svod);
        });

      await axios
        .get(
          `https://api.betaseries.com/shows/genres?key=${process.env.REACT_APP_KEY}&v=3.0`
        )
        .then((res) => res.data)
        .then((data) => setGenres(data.genres));

      await axios
        .get(
          `https://api.betaseries.com/search/shows?key=${
            process.env.REACT_APP_KEY
          }&v=3.0&text=${text}&limit=${limit}&offset=${
            currentPage - 1
          }&genres=${filterGenre}&diffusions=${filterDiffusion}&duration=${filterEpisodeDuration}&svods=${filterPlatform}&creations=${filterCreationDate}&pays=${filterCountry}&debut=${filterInitiale}&tri=${filterOrder}&autres=${filterFilter}`,
          config
        )
        .then((res) => res.data)
        .then((data) => {
          setShowList(data.shows);
          setShowsNumber(data.total);
        });
    }
    request();
  }, [
    text,
    limit,
    currentPage,
    filterGenre,
    filterDiffusion,
    filterEpisodeDuration,
    filterPlatform,
    filterCreationDate,
    filterCountry,
    filterInitiale,
    filterOrder,
    filterFilter,
  ]);

  useEffect(() => {
    async function request() {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const idList = [];
      showList.map((show) => idList.push(show.id));
      setShowsId(idList.join(","));

      showsId.length !== 0 &&
        (await axios
          .get(
            `https://api.betaseries.com/shows/display?key=${process.env.REACT_APP_KEY}&v=3.0&id=${showsId}`
          )
          .then((res) => res.data)
          .then((data) =>
            idList.length > 1
              ? setShowResult(data.shows)
              : setShowResultOneOnly(data.show)
          ));
    }
    request();
  }, [showList, showsId]);

  const promptFunction = () => {
    let text;
    let date = prompt("Écrivez une année", "2018");
    if (date === null || date === "") {
      text = "Autre";
      setFilterCreationDate(filterCreationDate.filter((a) => a !== date));
    } else {
      text = "Autre : " + date;
    }
    document.getElementById("otherDate").innerHTML = text;
    filterCreationDate.includes(date)
      ? setFilterCreationDate(filterCreationDate.filter((a) => a !== date))
      : setFilterCreationDate((prevState) => {
          return [...prevState, date];
        });
  };

  const reinitiate = () => {
    setText("");
    setCurrentPage(1);
    setFilterGenre([]);
    setFilterDiffusion([]);
    setFilterEpisodeDuration([]);
    setFilterPlatform([]);
    setFilterCreationDate([]);
    setFilterCountry([]);
    setFilterInitiale([]);
    setFilterOrder("popularite");
    setFilterFilter("");
  };

  return (
    <>
      <div className="shows">
        <div className="searchFilter">
          <div className="searchInput">
            <FaSearch size={15} />
            <input
              type="text"
              placeholder="Nom de la série"
              onChange={(e) => {
                setText(e.target.value);
              }}
            />
          </div>
          <div className="selectContainer">
            <div
              onClick={openingPlatform}
              className={
                openPlatform ? `selectTitle selectTitleOpen` : "selectTitle"
              }
            >
              <div>
                <BiCaretRightSquare size={25} />
                <span>Plateforme</span>
              </div>
              <div>
                <span
                  className={
                    filterPlatform.length !== 0 && openPlatform
                      ? `filterNumber filterNumberOpen`
                      : filterPlatform.length !== 0
                      ? "filterNumber"
                      : ""
                  }
                >
                  {filterPlatform.length !== 0 && filterPlatform.length}
                </span>
                {openPlatform ? (
                  <FiChevronUp size={20} />
                ) : (
                  <FiChevronDown size={20} />
                )}
              </div>
            </div>
            <div className={openPlatform ? "menu-actif" : "menu"}>
              {platforms.map((platform) => (
                <button
                  key={platform.id}
                  value={platform.id}
                  onClick={() => {
                    filterPlatform.includes(platform.id)
                      ? setFilterPlatform(
                          filterPlatform.filter((a) => a !== platform.id)
                        ) && setCurrentPage(1)
                      : setFilterPlatform((prevState) => {
                          return [...prevState, platform.id];
                        });
                  }}
                  className={
                    filterPlatform.includes(platform.id) ? "filterSelected" : ""
                  }
                >
                  {platform.name}
                </button>
              ))}
            </div>
          </div>
          <div className="selectContainer">
            <div
              className={
                openGenre ? `selectTitle selectTitleOpen` : "selectTitle"
              }
              onClick={openingGenre}
            >
              <div>
                <FaTheaterMasks size={25} />
                <span>Genre</span>
              </div>
              <div>
                <span
                  className={
                    filterGenre.length !== 0 && openGenre
                      ? `filterNumber filterNumberOpen`
                      : filterGenre.length !== 0
                      ? "filterNumber"
                      : ""
                  }
                >
                  {filterGenre.length !== 0 && filterGenre.length}
                </span>
                {openGenre ? (
                  <FiChevronUp size={20} />
                ) : (
                  <FiChevronDown size={20} />
                )}
              </div>
            </div>
            <div className={openGenre ? "menu-actif" : "menu"}>
              {Object.keys(genres).map((key, index) => (
                <button
                  key={index}
                  value={index}
                  onClick={() =>
                    filterGenre.includes(key)
                      ? setFilterGenre(filterGenre.filter((a) => a !== key))
                      : setFilterGenre((prevState) => {
                          return [...prevState, key];
                        })
                  }
                  className={filterGenre.includes(key) ? "filterSelected" : ""}
                >
                  {genres[key]}
                </button>
              ))}
            </div>
          </div>
          <div className="selectContainer">
            <div
              className={
                openDiffusion ? `selectTitle selectTitleOpen` : "selectTitle"
              }
              onClick={openingDiffusion}
            >
              <div>
                <BsCalendarCheck size={25} />
                <span>Diffusion</span>
              </div>
              <div>
                <span
                  className={
                    filterDiffusion.length !== 0 && openDiffusion
                      ? `filterNumber filterNumberOpen`
                      : filterDiffusion.length !== 0
                      ? "filterNumber"
                      : ""
                  }
                >
                  {filterDiffusion.length !== 0 && filterDiffusion.length}
                </span>
                {openDiffusion ? (
                  <FiChevronUp size={20} />
                ) : (
                  <FiChevronDown size={20} />
                )}
              </div>
            </div>
            <div className={openDiffusion ? "menu-actif" : "menu"}>
              <button
                value="semaine"
                onClick={() =>
                  filterDiffusion.includes("semaine")
                    ? setFilterDiffusion(
                        filterDiffusion.filter((a) => a !== "semaine")
                      )
                    : setFilterDiffusion((prevState) => {
                        return [...prevState, "semaine"];
                      })
                }
                className={
                  filterDiffusion.includes("semaine") ? "filterSelected" : ""
                }
              >
                Cette semaine
              </button>
              <button
                value="encours"
                onClick={() =>
                  filterDiffusion.includes("encours")
                    ? setFilterDiffusion(
                        filterDiffusion.filter((a) => a !== "encours")
                      )
                    : setFilterDiffusion((prevState) => {
                        return [...prevState, "encours"];
                      })
                }
                className={
                  filterDiffusion.includes("encours") ? "filterSelected" : ""
                }
              >
                En cours
              </button>
              <button
                value="fini"
                onClick={() =>
                  filterDiffusion.includes("fini")
                    ? setFilterDiffusion(
                        filterDiffusion.filter((a) => a !== "fini")
                      )
                    : setFilterDiffusion((prevState) => {
                        return [...prevState, "fini"];
                      })
                }
                className={
                  filterDiffusion.includes("fini") ? "filterSelected" : ""
                }
              >
                Terminée
              </button>
            </div>
          </div>
          <div className="selectContainer">
            <div
              className={
                openCreationDate ? `selectTitle selectTitleOpen` : "selectTitle"
              }
              onClick={openingCreationDate}
            >
              <div>
                <BsClock size={25} />
                <span>Année de création</span>
              </div>
              <div>
                <span
                  className={
                    filterCreationDate.length !== 0 && openCreationDate
                      ? `filterNumber filterNumberOpen`
                      : filterCreationDate.length !== 0
                      ? "filterNumber"
                      : ""
                  }
                >
                  {filterCreationDate.length !== 0 && filterCreationDate.length}
                </span>
                {openCreationDate ? (
                  <FiChevronUp size={20} />
                ) : (
                  <FiChevronDown size={20} />
                )}
              </div>
            </div>
            <div className={openCreationDate ? "menu-actif" : "menu"}>
              <button
                value="2022"
                onClick={() =>
                  filterCreationDate.includes("2022")
                    ? setFilterCreationDate(
                        filterCreationDate.filter((a) => a !== "2022")
                      )
                    : setFilterCreationDate((prevState) => {
                        return [...prevState, "2022"];
                      })
                }
                className={
                  filterCreationDate.includes("2022") ? "filterSelected" : ""
                }
              >
                2022
              </button>
              <button
                value="2021"
                onClick={() =>
                  filterCreationDate.includes("2021")
                    ? setFilterCreationDate(
                        filterCreationDate.filter((a) => a !== "2021")
                      )
                    : setFilterCreationDate((prevState) => {
                        return [...prevState, "2021"];
                      })
                }
                className={
                  filterCreationDate.includes("2021") ? "filterSelected" : ""
                }
              >
                2021
              </button>
              <button
                value="2020"
                onClick={() =>
                  filterCreationDate.includes("2020")
                    ? setFilterCreationDate(
                        filterCreationDate.filter((a) => a !== "2020")
                      )
                    : setFilterCreationDate((prevState) => {
                        return [...prevState, "2020"];
                      })
                }
                className={
                  filterCreationDate.includes("2020") ? "filterSelected" : ""
                }
              >
                2020
              </button>
              <button
                value="2019"
                onClick={() =>
                  filterCreationDate.includes("2019")
                    ? setFilterCreationDate(
                        filterCreationDate.filter((a) => a !== "2019")
                      )
                    : setFilterCreationDate((prevState) => {
                        return [...prevState, "2019"];
                      })
                }
                className={
                  filterCreationDate.includes("2019") ? "filterSelected" : ""
                }
              >
                2019
              </button>
              <button
                id="otherDate"
                onClick={() => promptFunction()}
                className={
                  filterCreationDate.length !== 0 &&
                  filterCreationDate.values !== "2022" &&
                  filterCreationDate.values !== "2021" &&
                  filterCreationDate.values !== "2020" &&
                  filterCreationDate.values !== "2019"
                    ? "filterSelected"
                    : ""
                }
              >
                Autre
              </button>
            </div>
          </div>
          <div className="selectContainer">
            <div
              className={
                openCountry ? `selectTitle selectTitleOpen` : "selectTitle"
              }
              onClick={openingCountry}
            >
              <div>
                <BsFlag size={25} />
                <span>Pays</span>
              </div>
              <div>
                <span
                  className={
                    filterCountry.length !== 0 && openCountry
                      ? `filterNumber filterNumberOpen`
                      : filterCountry.length !== 0
                      ? "filterNumber"
                      : ""
                  }
                >
                  {filterCountry.length !== 0 && filterCountry.length}
                </span>
                {openCountry ? (
                  <FiChevronUp size={20} />
                ) : (
                  <FiChevronDown size={20} />
                )}
              </div>
            </div>
            <div className={openCountry ? "menu-actif" : "menu"}>
              {countries.map((country) => (
                <button
                  key={country.id}
                  value={country.id}
                  onClick={() =>
                    filterCountry.includes(country.id)
                      ? setFilterCountry(
                          filterCountry.filter((a) => a !== country.id)
                        )
                      : setFilterCountry((prevState) => {
                          return [...prevState, country.id];
                        })
                  }
                  className={
                    filterCountry.includes(country.id) ? "filterSelected" : ""
                  }
                >
                  {country.name}
                </button>
              ))}
              <select
                name="other-country"
                onChange={(e) =>
                  filterCountry.includes(e.target.value)
                    ? setFilterCountry(
                        filterCountry.filter((a) => a !== e.target.value)
                      )
                    : setFilterCountry((prevState) => {
                        return [...prevState, e.target.value];
                      })
                }
              >
                <option value="">Sélectionner un pays</option>
                {otherCountries.map((country) => (
                  <option key={country.id} value={country.id}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="selectContainer">
            <div
              className={
                openDurationEpisode
                  ? `selectTitle selectTitleOpen`
                  : "selectTitle"
              }
              onClick={openingDurationEpisode}
            >
              <div>
                <MdTimer size={25} />
                <span>Durée d'un épisode</span>
              </div>
              <div>
                <span
                  className={
                    filterEpisodeDuration.length !== 0 && openDurationEpisode
                      ? `filterNumber filterNumberOpen`
                      : filterEpisodeDuration.length !== 0
                      ? "filterNumber"
                      : ""
                  }
                >
                  {filterEpisodeDuration.length !== 0 &&
                    filterEpisodeDuration.length}
                </span>
                {openDurationEpisode ? (
                  <FiChevronUp size={20} />
                ) : (
                  <FiChevronDown size={20} />
                )}
              </div>
            </div>
            <div className={openDurationEpisode ? "menu-actif" : "menu"}>
              {durations.map((duration) => (
                <button
                  key={duration.id}
                  value={duration.id}
                  onClick={() =>
                    filterEpisodeDuration.includes(duration.id)
                      ? setFilterEpisodeDuration(
                          filterEpisodeDuration.filter((a) => a !== duration.id)
                        )
                      : setFilterEpisodeDuration((prevState) => {
                          return [...prevState, duration.id];
                        })
                  }
                  className={
                    filterEpisodeDuration.includes(duration.id)
                      ? "filterSelected"
                      : ""
                  }
                >
                  {duration.name}
                </button>
              ))}
            </div>
          </div>
          <div className="selectContainer">
            <div
              className={
                openNew ? `selectTitle selectTitleOpen` : "selectTitle"
              }
              onClick={openingNew}
            >
              <div>
                <FiSliders size={25} />
                <span>Autres options </span>
              </div>
              <div>
                <span
                  className={
                    filterFilter.length !== 0 && openNew
                      ? `filterNumber filterNumberOpen`
                      : filterFilter.length !== 0
                      ? "filterNumber"
                      : ""
                  }
                >
                  {filterFilter.length !== 0 && filterFilter.length}
                </span>
                {openNew ? (
                  <FiChevronUp size={20} />
                ) : (
                  <FiChevronDown size={20} />
                )}
              </div>
            </div>
            <div className={openNew ? "menu-actif" : "menu"}>
              <button
                value="new"
                onClick={() =>
                  filterFilter.includes("new")
                    ? setFilterFilter(filterFilter.filter((a) => a !== "new"))
                    : setFilterFilter((prevState) => {
                        return [...prevState, "new"];
                      })
                }
                className={filterFilter.includes("new") ? "filterSelected" : ""}
              >
                Uniquement les séries que je ne suis pas
              </button>
              <button
                value=""
                onClick={() =>
                  filterFilter.includes("mine")
                    ? setFilterFilter(filterFilter.filter((a) => a !== "mine"))
                    : setFilterFilter((prevState) => {
                        return [...prevState, "mine"];
                      })
                }
                className={
                  filterFilter.includes("mine") ? "filterSelected" : ""
                }
              >
                Uniquement les séries que je suis
              </button>
            </div>
          </div>
          <div className="selectContainer">
            <div
              className={
                openInitiales ? `selectTitle selectTitleOpen` : "selectTitle"
              }
              onClick={openingInitiales}
            >
              <div>
                <BsCursorText size={25} />
                <span>Initales</span>
              </div>
              <div>
                <span
                  className={
                    filterInitiale.length !== 0 && openInitiales
                      ? `filterNumber filterNumberOpen`
                      : filterInitiale.length !== 0
                      ? "filterNumber"
                      : ""
                  }
                >
                  {filterInitiale.length !== 0 && filterInitiale.length}
                </span>
                {openInitiales ? (
                  <FiChevronUp size={20} />
                ) : (
                  <FiChevronDown size={20} />
                )}
              </div>
            </div>
            <div className={openInitiales ? "initiales-actif" : "menu"}>
              {initiales.map((initiale) => (
                <button
                  key={initiale}
                  value={initiale}
                  onClick={() => {
                    filterInitiale === initiale
                      ? setFilterInitiale("")
                      : setFilterInitiale(initiale);
                  }}
                  className={
                    filterInitiale === initiale ? "filterSelected" : ""
                  }
                >
                  {initiale}
                </button>
              ))}
            </div>
          </div>
          <div className="selectContainer">
            <button
              className="reinitiate"
              type="button"
              onClick={() => reinitiate()}
            >
              <BiRotateLeft size={25} />
              <span>Réinitialiser les filtres</span>
            </button>
          </div>
        </div>
        <div className="listShows">
          <div className="mainTitle">
            <h1>Annuaire des séries ({showsNumber})</h1>
            <div className="sortingButton">
              <span className="currentTri" onClick={openingOrderFilter}>
                {filterOrder === "popularite"
                  ? "Popularité"
                  : filterOrder === "suivis"
                  ? "Suivis"
                  : filterOrder === "nom"
                  ? "Nom"
                  : filterOrder === "note"
                  ? "Note"
                  : filterOrder === "id"
                  ? "Date d'ajout"
                  : filterOrder === "release-asc"
                  ? "Séries plus anciennes"
                  : filterOrder === "release-desc"
                  ? "Séries plus récentes"
                  : ""}{" "}
                <IoMdArrowDropdown />
              </span>
              <span
                className={
                  openOrderFilter ? `toggleTri toggleTriActive` : "toggleTri"
                }
              >
                <button
                  type="button"
                  id="popularite"
                  onClick={(e) => {
                    openingOrderFilter();
                    setFilterOrder(e.target.id);
                  }}
                >
                  Popularité
                </button>
                <button
                  type="button"
                  id="suivis"
                  onClick={(e) => {
                    openingOrderFilter();
                    setFilterOrder(e.target.id);
                  }}
                >
                  Suivis
                </button>
                <button
                  type="button"
                  id="nom"
                  onClick={(e) => {
                    openingOrderFilter();
                    setFilterOrder(e.target.id);
                  }}
                >
                  Nom
                </button>
                <button
                  type="button"
                  id="note"
                  onClick={(e) => {
                    openingOrderFilter();
                    setFilterOrder(e.target.id);
                  }}
                >
                  Note
                </button>
                <button
                  type="button"
                  id="id"
                  onClick={(e) => {
                    openingOrderFilter();
                    setFilterOrder(e.target.id);
                  }}
                >
                  Date d'ajout
                </button>
                <button
                  type="button"
                  id="release-asc"
                  onClick={(e) => {
                    openingOrderFilter();
                    setFilterOrder(e.target.id);
                  }}
                >
                  Séries plus anciennes
                </button>
                <button
                  type="button"
                  id="release-desc"
                  onClick={(e) => {
                    openingOrderFilter();
                    setFilterOrder(e.target.id);
                  }}
                >
                  Séries plus récentes
                </button>
              </span>
            </div>
          </div>
          <div className="showCard">
            {showResult.length > 0 &&
              showResult.map((show) => <ShowCard show={show} key={show.id} />)}
            {showResultOneOnly.length > 0 && (
              <ShowCard show={showResultOneOnly} />
            )}
          </div>
          <div className="paginationShows">
            <Pagination
              index={Math.ceil(showsNumber / limit)}
              setCurrentPage={setCurrentPage}
              currentPage={currentPage}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Shows;
