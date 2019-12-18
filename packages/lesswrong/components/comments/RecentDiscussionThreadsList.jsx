import React, { useState, useCallback } from 'react';
import { Components, registerComponent, withList, withUpdate } from 'meteor/vulcan:core';
import { Posts } from '../../lib/collections/posts';
import { Comments } from '../../lib/collections/comments'
import { useCurrentUser } from '../common/withUser';
import AddBoxIcon from '@material-ui/icons/AddBox';
import { useGlobalKeydown } from '../common/withGlobalKeydown';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  // TODO; make this work on lwTheme
  sectionTitleTitle: {},
  sectionTitleChildren: {},
})

const RecentDiscussionThreadsList = ({
  results, loading, loadMore, networkStatus, updateComment, data: { refetch },
  title="Recent Discussion", shortformButton=true, classes
}) => {
  const [expandAllThreads, setExpandAllThreads] = useState(false);
  const [showShortformFeed, setShowShortformFeed] = useState(false);
  const currentUser = useCurrentUser();
  
  useGlobalKeydown(ev => {
    const F_Key = 70
    if ((event.metaKey || event.ctrlKey) && event.keyCode == F_Key) {
      setExpandAllThreads(true);
    }
  });
  
  const toggleShortformFeed = useCallback(
    () => {
      setShowShortformFeed(!showShortformFeed);
    },
    [setShowShortformFeed, showShortformFeed]
  );
  
  const { SingleColumnSection, SectionTitle, SectionButton, ShortformSubmitForm, Loading } = Components
  
  const loadingMore = networkStatus === 2;

  const { LoadMore } = Components

  if (!loading && results && !results.length) {
    return null
  }

  const expandAll = currentUser?.noCollapseCommentsFrontpage || expandAllThreads

  // TODO: Probably factor out "RecentDiscussionThreadsList" vs "RecentDiscussionSection", rather than making RecentDiscussionThreadsList cover both and be weirdly customizable
  return (
    <SingleColumnSection>
      <SectionTitle
        title={title}
        customClasses={{title: classes.sectionTitleTitle, children: classes.sectionTitleChildren}}
      >
        {currentUser?.isReviewed && shortformButton && <div onClick={toggleShortformFeed}>
          <SectionButton>
            <AddBoxIcon />
            New Shortform Post
          </SectionButton>
        </div>}
      </SectionTitle>
      {showShortformFeed && <ShortformSubmitForm successCallback={refetch}/>}
      <div>
        {results && <div>
          {results.map((post, i) =>
            <Components.RecentDiscussionThread
              key={post._id}
              post={post}
              postCount={i}
              refetch={refetch}
              comments={post.recentComments}
              expandAllThreads={expandAll}
              currentUser={currentUser}
              updateComment={updateComment}/>
          )}
        </div>}
        { loadMore && <LoadMore loading={loadingMore || loading} loadMore={loadMore}  /> }
        { (loading || loadingMore) && <Loading />}
      </div>
    </SingleColumnSection>
  )
}

registerComponent('RecentDiscussionThreadsList', RecentDiscussionThreadsList,
  [withList, {
    collection: Posts,
    queryName: 'selectCommentsListQuery',
    fragmentName: 'PostsRecentDiscussion',
    fetchPolicy: 'cache-and-network',
    enableTotal: false,
    pollInterval: 0,
    extraVariables: {
      commentsLimit: 'Int',
      maxAgeHours: 'Int',
      af: 'Boolean',
    },
    ssr: true,
  }],
  [withUpdate, {
    collection: Comments,
    fragmentName: 'CommentsList',
  }],
  withStyles(styles, {name: "ConfigurableRecommendationsList"})
);
