import React from "react";

const ShowCard = ({ show }) => {
  return (
    <div className="resultContainer">
      <img
        src={
          show.images && show.images.poster
            ? show.images.poster
            : "images/pas-dimage.webp"
        }
        alt="poster série"
      />
      <div className="mediaBody">
        <h2>
          {show.title.length > 20
            ? show.title.slice(0, 20) + "..."
            : show.title}
        </h2>
        {Object.values(show.genres) && Object.values(show.genres).length > 4 ? (
          <p>{Object.values(show.genres).slice(0, 4).join(", ")}...</p>
        ) : Object.values(show.genres) &&
          Object.values(show.genres).length <= 4 ? (
          <p>{Object.values(show.genres).join(", ")}</p>
        ) : (
          ""
        )}
        <div className="platformsEpisodes">
          {show.platforms && show.platforms.svods ? (
            <div className="platformsContainer">
              Plateforme :{" "}
              {show.platforms.svods.map((platform) => (
                <p key={platform.id}>{platform.name}</p>
              ))}
            </div>
          ) : show.platforms && show.platforms.forced ? (
            <div className="platformsContainer">
              Plateforme :{" "}
              {show.platforms.forced.map((platform) => (
                <p key={platform.id}>{platform.name}</p>
              ))}
            </div>
          ) : (
            <p>{show.episodes} épisodes</p>
          )}
          {(show.platforms && show.platforms.svods) ||
          (show.platforms && show.platforms.forced) ? (
            <span>{show.episodes} épisodes</span>
          ) : (
            ""
          )}
        </div>

        <p>
          Statut :{" "}
          {show.status === "Ended"
            ? "Terminée"
            : show.status === "Continuing"
            ? "En cours"
            : ""}
        </p>
        <div className="flexContainer">
          <p>{show.creation}</p>
          <p>
            {show.notes.mean.toFixed(1)}/5 <span>⭐</span>
          </p>
        </div>
        <p className="description">
          {show.description.split(" ").slice(0, 20).join(" ")}...
        </p>
      </div>
    </div>
  );
};

export default ShowCard;
