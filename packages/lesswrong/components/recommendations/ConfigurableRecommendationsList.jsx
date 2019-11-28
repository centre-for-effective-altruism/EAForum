import React, { PureComponent } from 'react';
import { Components, registerComponent, getSetting } from 'meteor/vulcan:core';
import Tooltip from '@material-ui/core/Tooltip';
import withUser from '../common/withUser';
import { Link } from '../../lib/reactRouterWrapper'
import { getRecommendationSettings } from './RecommendationsAlgorithmPicker'
import { withStyles } from '@material-ui/core/styles';

const recommendedName = getSetting('forumType') === 'EAForum' ? 'Community Favorites' : 'Recommended'

const styles = theme => ({
  sectionTitleTitle: {
    // TODO; move to EA Theme
    // Super custom width matched to wording
    '@media (max-width: 449.95px)': {
      width: 155
    },
  },
});

class ConfigurableRecommendationsList extends PureComponent {
  state = {
    settingsVisible: false,
    settings: null
  }

  toggleSettings = () => {
    this.setState({
      settingsVisible: !this.state.settingsVisible,
    });
  }

  changeSettings = (newSettings) => {
    this.setState({
      settings: newSettings
    });
  }

  render() {
    const { currentUser, configName, classes } = this.props;
    const { SingleColumnSection, SectionTitle, RecommendationsAlgorithmPicker,
      RecommendationsList, SettingsIcon } = Components;
    const settings = getRecommendationSettings({settings: this.state.settings, currentUser, configName})
    // console.log('classes', classes)

    return <SingleColumnSection>
      <SectionTitle
        title={<Tooltip
          title={`A weighted, randomized sample of the highest karma posts${settings.onlyUnread ? " that you haven't read yet" : ""}.`}
        >
          <Link to={'/recommendations'}>
            {recommendedName}
          </Link>
        </Tooltip>}
        customClasses={{title: classes.sectionTitleTitle}}
      >
        <SettingsIcon onClick={this.toggleSettings}/>
      </SectionTitle>
      { this.state.settingsVisible &&
        <RecommendationsAlgorithmPicker
          configName={configName}
          settings={settings}
          onChange={(newSettings) => this.changeSettings(newSettings)}
        /> }
      <RecommendationsList
        algorithm={settings}
      />
    </SingleColumnSection>
  }
}

registerComponent(
  "ConfigurableRecommendationsList", ConfigurableRecommendationsList,
  withUser, withStyles(styles, {name: "ConfigurableRecommendationsList"})
);
