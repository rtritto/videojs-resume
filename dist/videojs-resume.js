(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (global){(function (){
"use strict";

var _video = _interopRequireDefault((typeof window !== "undefined" ? window['videojs'] : typeof global !== "undefined" ? global['videojs'] : null));
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}
const Button = _video.default.getComponent('Button');
const Component = _video.default.getComponent('Component');
const ModalDialog = _video.default.getComponent('ModalDialog');
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
_video.default.registerComponent('ResumeButton', ResumeButton);
_video.default.registerComponent('ResumeCancelButton', ResumeCancelButton);
_video.default.registerComponent('ModalButtons', ModalButtons);
_video.default.registerComponent('ResumeModal', ResumeModal);
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
_video.default.registerPlugin('Resume', Resume);

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[1]);
