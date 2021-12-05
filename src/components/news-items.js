import React from "react"
import {StaticQuery, graphql, Link} from "gatsby"

const NewsItems = () =>
    ( <>
    <StaticQuery query={graphql`
      {
        allContentfulNews {
          edges {
            node {
              title
              thumbnail {
                file{
                url
                }
              }
            }
          }
        }
      }
    `}
        render={data =>
            <>
                    <div className="blog-container">
                      {data?.allContentfulNews?.edges?.map(({ node }, i) => (
                          <div className="blog-card">
                              <img src='{node?.thumbnail?.file?.url}' />
                              <h4>{node?.title}</h4>
                              <Link to="#">Read more</Link>
                          </div>
                      ))}
                  </div>
            </>
        }
    ></StaticQuery>
    </>
)

export default NewsItems