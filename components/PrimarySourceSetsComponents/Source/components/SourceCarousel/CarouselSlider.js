import React from "react";
import Slider from "react-slick";
import Link from "next/link";

import NextArrow from "./NextArrow";
import PrevArrow from "./PrevArrow";
import { classNames } from "./SourceCarousel.css";
import breakpoints from "css/breakpoints.css";
import extractSourceId from "/utilFunctions/extractSourceId";
import removeQueryParams from "/utilFunctions/removeQueryParams";

const CarouselSlider = ({ currentSourceIdx, sources, route }) =>
  <Slider
    slidesToShow={6}
    infinite={false}
    nextArrow={<NextArrow />}
    prevArrow={<PrevArrow />}
    draggable={false}
    slidesToScroll={1}
    initialSlide={
      // makes sure carousel is always showing 6 items
      currentSourceIdx > sources.length - 6
        ? sources.length - 6
        : currentSourceIdx
    }
    responsive={[
      {
        breakpoint: parseInt(breakpoints.smallPx, 10),
        settings: {
          centerMode: true,
          centerPadding: "12.5%",
          slidesToShow: 1.25,
          arrows: false,
          draggable: true
        }
      }
    ]}
  >
    {sources.map(({ name, thumbnailUrl }, i) =>
      <div>
        {/* for some reason react-slick can't have <Link/> as first child */}
        <Link
          as={{
            pathname: `/primary-source-sets/${route.query
              .set}/sources/${extractSourceId(sources[i]["@id"])}`,
            query: removeQueryParams(route.query, ["source", "set"])
          }}
          href={{
            pathname: `/primary-source-sets/set/sources`,
            query: Object.assign({}, route.query, {
              source: extractSourceId(sources[i]["@id"])
            })
          }}
        >
          <a className={classNames.item}>
            <div
              className={[
                classNames.itemImgWrapper,
                i === currentSourceIdx && classNames.currentItemImgWrapper
              ].join(" ")}
            >
              <img
                alt={name}
                className={classNames.itemImg}
                src={thumbnailUrl}
              />
            </div>
            <p className={classNames.itemText}>
              {name}
            </p>
          </a>
        </Link>
      </div>
    )}
  </Slider>;

export default CarouselSlider;