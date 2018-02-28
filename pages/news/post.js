import React from "react";
import fetch from "isomorphic-fetch";
import Link from "next/link";

import MainLayout from "components/MainLayout";
import BreadcrumbsModule from "shared/BreadcrumbsModule";
import ContentPagesSidebar from "components/shared/ContentPagesSidebar";
import WPEdit from "shared/WPEdit";

import { formatDate } from "utilFunctions";

import { SITE_ENV } from "constants/env";
import { TITLE, DESCRIPTION, NEWS_TAGS } from "constants/news";
import {
  PRO_MENU_ENDPOINT,
  ABOUT_MENU_ENDPOINT,
  NEWS_ENDPOINT,
  SEO_TYPE
} from "constants/content-pages";
import { WORDPRESS_URL } from "constants/env";

import {
  classNames as contentClasses,
  stylesheet as contentStyles
} from "css/pages/content-pages-wysiwyg.css";
import { classNames as utilClassNames } from "css/utils.css";
import { classNames, stylesheet } from "css/pages/news.css";

const { container } = utilClassNames;

const PostPage = ({ url, content, menuItems, author }) => {
  let hasTags = false;
  NEWS_TAGS.forEach(tag => {
    if (content.tags.indexOf(tag.id) !== -1) {
      hasTags = true;
      return;
    }
  });
  return (
    <MainLayout
      route={url}
      pageTitle={content.title.rendered}
      seoType={SEO_TYPE}
    >
      <BreadcrumbsModule
        breadcrumbs={[
          {
            title: "News",
            url: "/news",
            as: "/news"
          },
          { title: content.title.rendered }
        ]}
        route={url}
      />
      <div
        className={`${utilClassNames.container}
      ${contentClasses.sidebarAndContentWrapper}`}
      >
        <div className="row">
          <ContentPagesSidebar
            route={url}
            items={menuItems}
            activeItemId={content.id}
            className={contentClasses.sidebar}
            rootPath="wp"
          />
          <div className="col-xs-12 col-md-7">
            <div id="main" role="main" className={contentClasses.content}>
              <WPEdit page={content} url={url} />
              <h1
                dangerouslySetInnerHTML={{
                  __html: content.title.rendered
                }}
              />
              <div className={classNames.resultSummary}>
                <p>
                  Posted by{" "}
                  <Link
                    prefetch
                    href={{
                      pathname: "/news",
                      query: Object.assign(
                        {},
                        {
                          author: author.id
                        }
                      )
                    }}
                  >
                    <a title={`View more posts by ${author.name}`}>
                      {author.name}
                    </a>
                  </Link>{" "}
                  in {formatDate(content.date)}.
                </p>
              </div>
              {hasTags &&
                <div className={classNames.tags}>
                  Published under:
                  <ul>
                    {content.tags.map(id => {
                      const tag = NEWS_TAGS.filter(tag => tag.id === id)[0];
                      return tag
                        ? <li key={tag.id}>
                            <Link
                              prefetch
                              href={`/news?tag=${tag.name
                                .toLowerCase()
                                .replace(" ", "-")}`}
                            >
                              <a title={`View more posts under ${tag.name}`}>
                                {tag.name}
                              </a>
                            </Link>
                          </li>
                        : null;
                    })}
                  </ul>
                </div>}
              <div
                dangerouslySetInnerHTML={{ __html: content.content.rendered }}
              />
            </div>
          </div>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{ __html: contentStyles }} />
      <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
    </MainLayout>
  );
};

PostPage.getInitialProps = async ({ req, query, res }) => {
  // sidebar menu fetch
  const menuResponse = await fetch(
    SITE_ENV === "user" ? ABOUT_MENU_ENDPOINT : PRO_MENU_ENDPOINT
  );
  const menuJson = await menuResponse.json();

  // get news post
  const slug = query.slug;
  const postRes = await fetch(`${NEWS_ENDPOINT}?slug=${slug}`);
  const postJson = await postRes.json();

  // get author info
  const authorRes = await fetch(
    `${WORDPRESS_URL}/wp-json/wp/v2/users/${postJson[0].author}`
  );
  const authorJson = await authorRes.json();

  return {
    content: postJson[0], // endpoint returns array (WP doesnt allow duplicate slugs anyway)
    menuItems: menuJson.items,
    author: authorJson
  };
};

export default PostPage;
