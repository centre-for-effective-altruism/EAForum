import React from 'react';
import { Components, registerComponent } from 'meteor/vulcan:core';
import { Link } from '../../lib/reactRouterWrapper.jsx';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core/styles';
import withUser from '../common/withUser'

const styles = theme => ({
  hideOnMobile: {
    [theme.breakpoints.down('xs')]: {
      display: "none"
    }
  },
  timeRemaining: {
    marginTop: 6,
    marginBottom: 4
  },
  learnMore: {
    color: theme.palette.lwTertiary.main
  }
})

const FrontpageNominationPhase = ({classes, settings, currentUser}) => {
  const { SectionSubtitle, RecommendationsList, SectionFooter, HoverPreviewLink } = Components

  const reviewTooltip = <div>
    <div>The LessWrong community is reflecting on the best posts from 2018, in three phases</div>
    <ul>
      <li><em>Nomination</em> (Nov 21 – Dec 1st)</li>
      <li><em>Review</em> (Dec 2nd – 31st)</li>
      <li><em>Voting</em> (Jan 1st – 7th</li>
      <li>The LessWrong moderation team will incorporate that information, along with their judgment, into a "Best of 2018" book.</li>
    </ul>
    <div>(Currently this section shows a karma-weighted sample of posts from 2018)</div>
  </div>

  const review2018TopUrl = "/allPosts?after=2018-01-01&before=2019-01-01&limit=100&timeframe=allTime"
  const review2018MonthlyUrl = "/allPosts?after=2018-01-01&before=2019-01-01&limit=14&timeframe=monthly&includeShortform=false&reverse=true"

  if (settings.hideReview) return null

  const algorithm = {
    ...settings, 
    review2018: true, 
    onlyUnread: false,
    excludeDefaultRecommendations: true
  }

  return (
    <div>
      <Tooltip placement="top-start" title={reviewTooltip}>
        <div>
          <SectionSubtitle >
            <Link to={"/reviews"}>
              The LessWrong 2018 Review
            </Link>
            {currentUser?.karma >= 1000 ? <div className={classes.timeRemaining}>
            <em>You have until Dec 1st to nominate posts. (Posts need 2+ nominations, <span className={classes.learnMore}><HoverPreviewLink href="/posts/qXwmMkEBLL59NkvYR/the-lesswrong-2018-review" innerHTML={"learn more"}/></span>)</em>
          </div> : null}
          </SectionSubtitle>
        </div>
      </Tooltip>
      <RecommendationsList algorithm={algorithm} showLoginPrompt={false} />
      <SectionFooter>
        <Link to={"/nominations"}>
          View{" "}<span className={classes.hideOnMobile}>All{" "}</span>Nominations
        </Link>
        <Link to={review2018TopUrl}>
          Top 2018<span className={classes.hideOnMobile}>{" "}Posts</span>
        </Link>
        <Link to={review2018MonthlyUrl}>
          2018<span className={classes.hideOnMobile}>{" "}Posts</span>{" "}Monthly
        </Link>
      </SectionFooter>
    </div>
  )
}

registerComponent('FrontpageNominationPhase', FrontpageNominationPhase, withUser, withStyles(styles, {name:"FrontpageNominationPhase"}));
