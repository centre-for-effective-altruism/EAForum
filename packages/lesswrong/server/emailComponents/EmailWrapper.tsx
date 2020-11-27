import React from 'react';
import { siteNameWithArticleSetting } from '../../lib/instanceSettings';
import { registerComponent } from '../../lib/vulcan-lib';
import { getSiteUrl } from '../../lib/vulcan-lib/utils';

const styles = (theme: ThemeType): JssStyles => ({
  root: {
    "& img": {
      maxWidth: "100%",
    }
  },
})

// Wrapper for top-level formatting of emails, eg controling width and
// background color. See also the global CSS in renderEmail.js. Derived from
// wrapper.handlebars in Vulcan-Starter.
const EmailWrapper = ({user, unsubscribeAllLink, children, classes}: {
  user: DbUser,
  unsubscribeAllLink: string,
  children: React.ReactNode,
  classes: ClassesType,
}) => {
  const accountLink = `${getSiteUrl()}account`
  const siteNameWithArticle = siteNameWithArticleSetting.get()
  
  // Put props for some HTML elements in any-typed objects, because emails use
  // non-HTML5 attributes which the typechecker will complain about
  const bodyProps: any = {
    bgcolor: "white",
    leftmargin: "0",
    topmargin: "0",
    marginWidth: "0",
    marginHeight: "0",
  };
  const outerTableProps: any = {
    border: "0",
    width: "100%",
    height: "100%",
    cellPadding: "0",
    cellSpacing: "0",
    bgcolor: "#ffffff",
  };
  const outerTdProps: any = {
    align: "center",
    valign: "top",
    bgcolor: "#ffffff",
    style: {"backgroundColor": "#ffffff"},
  };
  const innerTableProps: any = {
    border: "0",
    width: "600",
    cellPadding: "0",
    cellSpacing: "0",
    bgcolor: "#ffffff",
  };
  const innerTdProps: any = {
    bgcolor: "#ffffff",
  };
  
  return (
    <body {...bodyProps}>
      <br/>

      {/* 100% wrapper */}
      <div className={classes.root}>
        <table {...outerTableProps}>
          <tbody>
            <tr>
              <td className="wrapper" {...outerTdProps}>

                {/* 600px container (white background) */}
                <table className="container" {...innerTableProps}>
                  <tbody>
                    <tr>
                      <td className="container-padding" {...innerTdProps}>
                        <br/>
                        {children}
                      </td>
                    </tr>
                    <tr><td className="container-padding">
                      <br/><br/>
                      <a href={unsubscribeAllLink}>Unsubscribe</a>{' '}
                      (from all emails from {siteNameWithArticle})
                      or <a href={accountLink}>Change your notifications settings</a>
                      <br/><br/>
                    </td></tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <br/><br/>
    </body>
  );
}

const EmailWrapperComponent = registerComponent("EmailWrapper", EmailWrapper, {styles});

declare global {
  interface ComponentTypes {
    EmailWrapper: typeof EmailWrapperComponent
  }
}
