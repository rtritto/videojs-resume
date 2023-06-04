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
  const title = options.title || 'Resume from where you left off?';
  const resumeButtonText = options.resumeButtonText || 'Resume';
  const cancelButtonText = options.cancelButtonText || 'No Thanks';
  const playbackOffset = options.playbackOffset || 0;
  const key = 'videojs-resume:' + videoId;
  this.on('timeupdate', function () {
    localStorage.setItem(key, this.currentTime());
  });
  this.on('ended', function () {
    localStorage.removeItem(key);
  });
  this.ready(function () {
    let resumeFromTime = localStorage.getItem(key);
    if (resumeFromTime) {
      if (resumeFromTime >= 5) {
        resumeFromTime -= playbackOffset;
      }
      if (resumeFromTime <= 0) {
        resumeFromTime = 0;
      }
      this.addChild('ResumeModal', {
        title,
        resumeButtonText,
        cancelButtonText,
        resumeFromTime,
        key
      });
    }
  });
};
videojs.registerPlugin('Resume', Resume);
