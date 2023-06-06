/*! @name videojs-resume @version 1.0.0 @license Apache-2.0 */
import videojs from 'video.js';

const Button = videojs.getComponent('Button');
const Component = videojs.getComponent('Component');
const ModalDialog = videojs.getComponent('ModalDialog');
class ResumeButton extends Button {
  constructor(player, options) {
    super(player, options);
    this.resumeFromTime = options.resumeFromTime;
    this.player = player;
  }
  buildCSSClass() {
    return 'vjs-resume';
  }
  createEl() {
    return super.createEl('button', {
      innerHTML: `${this.options_.buttonText}`
    });
  }
  handleClick() {
    this.player.resumeModal.close();
    this.player.currentTime(this.resumeFromTime);
    this.player.play();
    this.player.trigger('resumevideo');
  }
  handleKeyPress(event) {
    // Check for space bar (32) or enter (13) keys
    if (event.which === 32 || event.which === 13) {
      if (this.player.paused()) {
        this.player.play();
      } else {
        this.player.pause();
      }
      event.preventDefault();
    }
  }
}
ResumeButton.prototype.controlText_ = 'Resume';
class ResumeCancelButton extends Button {
  constructor(player, options) {
    super(player, options);
    this.player = player;
  }
  buildCSSClass() {
    return 'vjs-no-resume';
  }
  createEl() {
    return super.createEl('button', {
      innerHTML: `${this.options_.buttonText}`
    });
  }
  handleClick() {
    this.player.resumeModal.close();
    this.player.play();
    this.player.trigger('resumevideo');
  }
}
ResumeButton.prototype.controlText_ = 'No Thanks';
class ModalButtons extends Component {
  constructor(player, options) {
    super(player, options);
    this.addChild('ResumeButton', {
      buttonText: options.resumeButtonText,
      resumeFromTime: options.resumeFromTime
    });
    this.addChild('ResumeCancelButton', {
      buttonText: options.cancelButtonText,
      key: options.key
    });
  }
  createEl() {
    return super.createEl('div', {
      className: 'vjs-resume-modal-buttons',
      innerHTML: `<p>${this.options_.title}</p>`
    });
  }
}
class ResumeModal extends ModalDialog {
  constructor(player, options) {
    super(player, options);
    this.player_.resumeModal = this;
    this.open();
    this.addChild('ModalButtons', {
      title: options.title,
      resumeButtonText: options.resumeButtonText,
      cancelButtonText: options.cancelButtonText,
      resumeFromTime: options.resumeFromTime,
      key: options.key
    });
  }
  buildCSSClass() {
    return `vjs-resume-modal ${super.buildCSSClass()}`;
  }
}
videojs.registerComponent('ResumeButton', ResumeButton);
videojs.registerComponent('ResumeCancelButton', ResumeCancelButton);
videojs.registerComponent('ModalButtons', ModalButtons);
videojs.registerComponent('ResumeModal', ResumeModal);
const Resume = function (options) {
  const videoId = options.uuid;
  const key = 'videojs-resume:' + videoId;
  this.on('timeupdate', function () {
    localStorage.setItem(key, this.currentTime());
  });
  this.on('ended', function () {
    localStorage.removeItem(key);
  });
  this.ready(function () {
    const resumeFromTimeRaw = localStorage.getItem(key);
    if (resumeFromTimeRaw) {
      var _options$title, _options$resumeButton, _options$cancelButton;
      let resumeFromTime = Number.parseFloat(resumeFromTimeRaw);
      if (resumeFromTime >= 5) {
        var _options$playbackOffs;
        const playbackOffset = (_options$playbackOffs = options.playbackOffset) != null ? _options$playbackOffs : 0;
        resumeFromTime -= playbackOffset;
      }
      if (resumeFromTime <= 0) {
        resumeFromTime = 0;
      }
      this.addChild('ResumeModal', {
        title: (_options$title = options.title) != null ? _options$title : `Resume from <b>${videojs.time.formatTime(resumeFromTime)}</b>?`,
        resumeButtonText: (_options$resumeButton = options.resumeButtonText) != null ? _options$resumeButton : 'Resume',
        cancelButtonText: (_options$cancelButton = options.cancelButtonText) != null ? _options$cancelButton : 'No Thanks',
        resumeFromTime,
        key
      });
    }
  });
};
videojs.registerPlugin('Resume', Resume);
