import React from "react";
import Link from "next/link";

import { classNames, stylesheet } from "./ExhibitionsList.css";

const Exhibition = ({ exhibition, route, featured }) =>
  <Link
    href={{
      pathname: "/exhibitions/exhibition",
      query: Object.assign({}, route.query, { exhibition: exhibition.slug })
    }}
    as={{
      pathname: `/exhibitions/${exhibition.slug}`,
      query: route.query
    }}
  >
    <a className={classNames.exhibition}>
      <div
        className={classNames.exhibitionContent}
        style={{ backgroundImage: featured && `url("${exhibition.image}")` }}
      >
        <img alt={exhibition.title} src={exhibition.image} />
        <div className={classNames.overlay}>
          <p className={classNames.title}>{exhibition.title}</p>
        </div>
      </div>
    </a>
  </Link>;

const ThreeUp = ({ exhibitions, route }) =>
  <div className={classNames.threeUp}>
    <div className={classNames.featuredExhibition}>
      <Exhibition route={route} exhibition={exhibitions[0]} featured={true} />
    </div>
    <div className={classNames.twoVertical}>
      <Exhibition route={route} exhibition={exhibitions[1]} />
      <Exhibition route={route} exhibition={exhibitions[2]} />
    </div>
  </div>;

const ExhibitionsList = ({ exhibitions, route }) =>
  <div className={`${classNames.wrapper} site-max-width`}>
    <div className={classNames.row}>
      <ThreeUp route={route} exhibitions={exhibitions.slice(0, 3)} />
      <div className={classNames.remainingExhibitions}>
        {exhibitions
          .slice(3)
          .map(exhibition =>
            <Exhibition route={route} exhibition={exhibition} />
          )}
      </div>
    </div>
    <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
  </div>;

export default ExhibitionsList;