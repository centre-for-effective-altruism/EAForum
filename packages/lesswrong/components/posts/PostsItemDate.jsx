import React from 'react';
import { Components, registerComponent } from 'meteor/vulcan:core';
import { withStyles } from '@material-ui/core/styles';
import { ExpandedDate } from '../common/FormatDate.jsx';
import withHover from '../common/withHover.jsx';
import moment from 'moment-timezone';

export const POSTED_AT_WIDTH = 38
export const START_TIME_WIDTH = 72

const styles = theme => ({
  postedAt: {
    '&&': {
      width: POSTED_AT_WIDTH,
      fontWeight: 300,
      fontSize: "1rem",
      color: "rgba(0,0,0,.9)",
      [theme.breakpoints.down('sm')]: {
        width: "auto",
      }
    }
  },
  startTime: {
    '&&': {
      width: START_TIME_WIDTH,
      fontWeight: 300,
      fontSize: "1rem",
      color: "rgba(0,0,0,.9)",
      [theme.breakpoints.down('sm')]: {
        width: "auto",
      }
    }
  },
});

const PostsItemDate = ({post, classes, hover, anchorEl}) => {
  const { PostsItem2MetaInfo, EventTime, FormatDate, LWPopper } = Components;
  if (post.isEvent && post.startTime) {
    return <PostsItem2MetaInfo className={classes.startTime}>
      <LWPopper anchorEl={anchorEl} tooltip placement="top">
        <span>Event starts at <EventTime post={post} /></span>
      </LWPopper>
      <FormatDate date={post.startTime} format={"MMM Do"}/>
    </PostsItem2MetaInfo>
  }

  if (post.isEvent && !post.startTime) {
    return <PostsItem2MetaInfo className={classes.startTime}>
      <LWPopper anchorEl={anchorEl} tooltip placement="top">
        <span>To Be Determined</span>
      </LWPopper>
      <span>TBD</span>
    </PostsItem2MetaInfo>
  }

  if (post.curatedDate) {
    return <PostsItem2MetaInfo className={classes.postedAt}>
      <LWPopper anchorEl={anchorEl} tooltip placement="top">
        <div>
          <div>Curated on <ExpandedDate date={post.curatedDate}/></div>
          <div>Posted on <ExpandedDate date={post.postedAt}/></div>
        </div>
      </LWPopper>
      <span>{moment(new Date(post.curatedDate)).fromNow()}</span>
    </PostsItem2MetaInfo>
  }

  return <PostsItem2MetaInfo className={classes.postedAt}>
      <LWPopper anchorEl={anchorEl} tooltip placement="top">
        <ExpandedDate date={post.postedAt}/>
      </LWPopper>
      <span>{moment(new Date(post.postedAt)).fromNow()}</span>
    </PostsItem2MetaInfo>
}

registerComponent("PostsItemDate", PostsItemDate, withHover,
  withStyles(styles, {name: "PostsItemDate"}));
