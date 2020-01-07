import React from "react";
import Link from "next/link";
import Slider from "react-slick";

import { NextArrow, PrevArrow } from "components/shared/CarouselNavArrows";
import RelatedItem from "./RelatedItem"

import utils from "stylesheets/utils.scss";
import css from "./RelatedItemsModule.scss";

const RelatedItemsModule = ({ items }) => {
  return (
    <div className={css.wrapper}>
      <div className={[utils.container, css.relatedItems].join(" ")}>
        <h2 className={css.header}>Related Items</h2>
        {items.map((item, index) =>
          <RelatedItem item={item} index={index} />
        )}
      </div>
    </div>
  );
};

export default RelatedItemsModule;
