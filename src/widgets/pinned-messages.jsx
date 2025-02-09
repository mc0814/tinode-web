// Send message form.
import React from 'react';
import { injectIntl } from 'react-intl';
import { Drafty } from 'tinode-sdk';

import { previewFormatter } from '../lib/formatters.js';

class PinnedMessages extends React.PureComponent {
  constructor(props) {
    super(props);

    this.getSelectedIndex = this.getSelectedIndex.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleSelected = this.handleSelected.bind(this);
    this.handleMoveNext = this.handleMoveNext.bind(this);
    this.handleMovePrev = this.handleMovePrev.bind(this);
  }

  getSelectedIndex() {
    const list = (this.props.messages || []);
    return list.length - this.props.selected - 1;
  }

  handleCancel(e) {
    e.preventDefault();
    this.props.onCancel(this.props.messages[this.getSelectedIndex()].seq);
  }

  handleSelected(e) {
    e.preventDefault();
    this.props.onSelected(this.props.messages[this.getSelectedIndex()].seq);
  }

  handleMoveNext(e) {
    e.preventDefault();
    e.stopPropagation();
    const idx = Math.max(this.props.selected - 1, 0);
    if (idx != this.props.selected) {
      this.props.setSelected(idx);
    }
  }

  handleMovePrev(e) {
    e.preventDefault();
    e.stopPropagation();
    const idx = Math.min(this.props.selected + 1, (this.props.messages || []).length - 1);
    if (idx != this.props.selected) {
      this.props.setSelected(idx);
    }
  }

  render() {
    const selected = this.getSelectedIndex();
    let shown = (this.props.messages || [])[selected];
    shown = shown ? Drafty.format(shown.content, previewFormatter, {
      formatMessage: this.props.intl.formatMessage.bind(this.props.intl),
      authorizeURL: this.props.tinode.authorizeURL.bind(this.props.tinode)
    }) : null;

    const dots = [];
    this.props.messages.forEach(_ => {
      const cn = dots.length == selected ? 'adot' : 'dot';
      dots.push(<div key={dots.length} className={cn} />);
    });

    return shown ?
      (<div id="pinned-wrapper">
        {this.props.isAdmin ?
          <div className="cancel">
            <a href="#" onClick={this.handleCancel}><i className="material-icons gray">close</i></a>
          </div> :
          <div><i className="material-icons gray">push_pin</i></div>
        }
        <div className="pinned-scroll">{dots}</div>
        <div className="pinned" onClick={this.handleSelected}><p>{shown}</p></div>
        <div className="pinned-menu">
          <span className="menuTrigger upper">
            {selected > 0 ?
              <a href="#" onClick={this.handleMovePrev}>
                <i className="material-icons">expand_less</i>
              </a>
              : null
            }
          </span>
          <span className="menuTrigger lower">
            {this.props.selected > 0 ?
              <a href="#" onClick={this.handleMoveNext}>
                <i className="material-icons">expand_more</i>
              </a>
              : null
            }
          </span>
        </div>
      </div>) : null;
  }
}

export default injectIntl(PinnedMessages);
