'use strict';
 
const utils = require("./utils");
const cheerio = require("cheerio");
const log = require("npmlog");
let checkVerified = null;
log.maxRecordSize = 100;
function setOptions(_0x19978b, _0x119c34) {
  Object.keys(_0x119c34).map(function (_0x3b8427) {
    switch (_0x3b8427) {
      case "pauseLog":
        if (_0x119c34.pauseLog) {
          log.pause();
        }
        break;
      case "online":
        _0x19978b.online = Boolean(_0x119c34.online);
        break;
      case "logLevel":
        log.level = _0x119c34.logLevel;
        _0x19978b.logLevel = _0x119c34.logLevel;
        break;
      case "logRecordSize":
        log.maxRecordSize = _0x119c34.logRecordSize;
        _0x19978b.logRecordSize = _0x119c34.logRecordSize;
        break;
      case "selfListen":
        _0x19978b.selfListen = Boolean(_0x119c34.selfListen);
        break;
      case "listenEvents":
        _0x19978b.listenEvents = Boolean(_0x119c34.listenEvents);
        break;
      case "pageID":
        _0x19978b.pageID = _0x119c34.pageID.toString();
        break;
      case "updatePresence":
        _0x19978b.updatePresence = Boolean(_0x119c34.updatePresence);
        break;
      case "forceLogin":
        _0x19978b.forceLogin = Boolean(_0x119c34.forceLogin);
        break;
      case "userAgent":
        _0x19978b.userAgent = _0x119c34.userAgent;
        break;
      case "autoMarkDelivery":
        _0x19978b.autoMarkDelivery = Boolean(_0x119c34.autoMarkDelivery);
        break;
      case "autoMarkRead":
        _0x19978b.autoMarkRead = Boolean(_0x119c34.autoMarkRead);
        break;
      case "listenTyping":
        _0x19978b.listenTyping = Boolean(_0x119c34.listenTyping);
        break;
      case "proxy":
        if (typeof _0x119c34.proxy != "string") {
          delete _0x19978b.proxy;
          utils.setProxy();
        } else {
          _0x19978b.proxy = _0x119c34.proxy;
          utils.setProxy(_0x19978b.proxy);
        }
        break;
      case "autoReconnect":
        _0x19978b.autoReconnect = Boolean(_0x119c34.autoReconnect);
        break;
      case "emitReady":
        _0x19978b.emitReady = Boolean(_0x119c34.emitReady);
        break;
      default:
        log.warn("setOptions", "Unrecognized option given to setOptions: " + _0x3b8427);
        break;
    }
  });
}
function buildAPI(_0x18db84, _0x520ad2, _0x5085d7) {
  const _0x542029 = _0x5085d7.getCookies("https://www.facebook.com").filter(function (_0x21803d) {
    return _0x21803d.cookieString().split('=')[0] === "c_user";
  });
  const _0x10abd9 = _0x5085d7.getCookies("https://www.facebook.com").reduce(function (_0x598e93, _0x5679ce) {
    _0x598e93[_0x5679ce.cookieString().split('=')[0]] = _0x5679ce.cookieString().split('=')[1];
    return _0x598e93;
  }, {});
  if (_0x542029.length === 0) {
    throw {
      'error': "Error retrieving userID. This can be caused by a lot of things, including getting blocked by Facebook for logging in from an unknown location. Try logging in with a browser to verify."
    };
  }
  if (_0x520ad2.indexOf("/checkpoint/block/?next") > -1) {
    log.warn("login", "Checkpoint detected. Please log in with a browser to verify.");
  }
  const _0x44edd6 = _0x542029[0].cookieString().split('=')[1].toString();
  const _0x50e292 = _0x10abd9.i_user || null;
  log.info("login", "Logged in as " + _0x44edd6);
  try {
    clearInterval(checkVerified);
  } catch (_0x940b83) {}
  const _0x5550dc = (Math.random() * 2147483648 | 0).toString(16);
  const _0x250a5a = _0x520ad2.match(/irisSeqID:"(.+?)",appID:219994525426954,endpoint:"(.+?)"/);
  let _0x34e00d = null;
  let _0x23e495 = null;
  let _0x32a46c = null;
  let _0x582827 = null;
  if (_0x250a5a) {
    _0x32a46c = _0x250a5a[1];
    _0x34e00d = _0x250a5a[2];
    _0x23e495 = new URL(_0x34e00d).searchParams.get("region").toUpperCase();
  } else {
    const _0x209980 = _0x520ad2.match(/{"app_id":"219994525426954","endpoint":"(.+?)","iris_seq_id":"(.+?)"}/);
    if (_0x209980) {
      _0x32a46c = _0x209980[2];
      _0x34e00d = _0x209980[1].replace(/\\\//g, '/');
      _0x23e495 = new URL(_0x34e00d).searchParams.get("region").toUpperCase();
    } else {
      const _0x5883c4 = _0x520ad2.match(/(\["MqttWebConfig",\[\],{fbid:")(.+?)(",appID:219994525426954,endpoint:")(.+?)(",pollingEndpoint:")(.+?)(3790])/);
      if (_0x5883c4) {
        _0x34e00d = _0x5883c4[4];
        _0x23e495 = new URL(_0x34e00d).searchParams.get("region").toUpperCase();
        log.warn("login", "Cannot get sequence ID with new RegExp. Fallback to old RegExp (without seqID)...");
        log.info("login", "Got this account's message region: " + _0x23e495);
        log.info("login", "[Unused] Polling endpoint: " + _0x5883c4[6]);
      } else {
        log.warn("login", "Cannot get MQTT region & sequence ID.");
        _0x582827 = _0x520ad2;
      }
    }
  }
  const _0xbd6d11 = {
    'userID': _0x44edd6,
    'i_userID': _0x50e292,
    'jar': _0x5085d7,
    'clientID': _0x5550dc,
    'globalOptions': _0x18db84,
    'loggedIn': true,
    'access_token': "NONE",
    'clientMutationId': 0x0,
    'mqttClient': undefined,
    'lastSeqId': _0x32a46c,
    'syncToken': undefined,
    'wsReqNumber': 0x0,
    'wsTaskNumber': 0x0,
    'reqCallbacks': {},
    'mqttEndpoint': _0x34e00d,
    'region': _0x23e495,
    'firstListen': true
  };
  const _0x3a1e9d = {
    'setOptions': setOptions.bind(null, _0x18db84),
    'getAppState': function _0xf2bf03() {
      const _0x5ebd33 = utils.getAppState(_0x5085d7);
      return _0x5ebd33.filter((_0x569b6e, _0x207d2f, _0x3a6e43) => _0x3a6e43.findIndex(_0x5b8d22 => {
        return _0x5b8d22.key === _0x569b6e.key;
      }) === _0x207d2f);
    }
  };
  if (_0x582827) {
    _0x3a1e9d.htmlData = _0x582827;
  }
  const _0x20e644 = ["addExternalModule", "addUserToGroup", "changeAdminStatus", "changeArchivedStatus", "changeAvatar", "changeBio", "changeBlockedStatus", "changeGroupImage", "changeNickname", "changeThreadColor", "changeThreadEmoji", "createNewGroup", "createPoll", "deleteMessage", "deleteThread", "forwardAttachment", "getCurrentUserID", "getEmojiUrl", "getFriendsList", "getMessage", "getThreadHistory", "getThreadInfo", "getThreadList", "getThreadPictures", "getUserID", "getUserInfo", "handleFriendRequest", "handleMessageRequest", "listenMqtt", "logout", "markAsDelivered", "markAsRead", "markAsReadAll", "markAsSeen", "muteThread", "refreshFb_dtsg", "removeUserFromGroup", "resolvePhotoUrl", "searchForThread", "sendMessage", "sendTypingIndicator", "setMessageReaction", "setPostReaction", "setTitle", "threadColors", "unsendMessage", "unfriend", "uploadAttachment", "editMessage", "httpGet", "httpPost", "httpPostFormData"];
  const _0x436ec1 = utils.makeDefaults(_0x520ad2, _0x44edd6, _0xbd6d11);
  _0x20e644.map(_0x13d4af => _0x3a1e9d[_0x13d4af] = require("./src/" + _0x13d4af)(_0x436ec1, _0x3a1e9d, _0xbd6d11));
  return [_0xbd6d11, _0x436ec1, _0x3a1e9d];
}
function makeLogin(_0x14c4ab, _0x3d4fc1, _0x173511, _0x12f712, _0x51505b, _0x370287) {
  return function (_0x32eb73) {
    const _0x19fd7b = _0x32eb73.body;
    const _0x447ca0 = cheerio.load(_0x19fd7b);
    let _0x2e5d7e = [];
    _0x447ca0("#login_form input").map((_0x47ef43, _0x3455cc) => _0x2e5d7e.push({
      'val': _0x447ca0(_0x3455cc).val(),
      'name': _0x447ca0(_0x3455cc).attr("name")
    }));
    _0x2e5d7e = _0x2e5d7e.filter(function (_0xfd587e) {
      return _0xfd587e.val && _0xfd587e.val.length;
    });
    const _0x23c384 = utils.arrToForm(_0x2e5d7e);
    _0x23c384.lsd = utils.getFrom(_0x19fd7b, "[\"LSD\",[],{\"token\":\"", "\"}");
    _0x23c384.lgndim = Buffer.from("{\"w\":1440,\"h\":900,\"aw\":1440,\"ah\":834,\"c\":24}").toString("base64");
    _0x23c384.email = _0x3d4fc1;
    _0x23c384.pass = _0x173511;
    _0x23c384.default_persistent = '0';
    _0x23c384.lgnrnd = utils.getFrom(_0x19fd7b, "name=\"lgnrnd\" value=\"", "\"");
    _0x23c384.locale = "en_US";
    _0x23c384.timezone = "240";
    _0x23c384.lgnjs = ~~(Date.now() / 1000);
    const _0x2b70f4 = _0x19fd7b.split("\"_js_");
    _0x2b70f4.slice(1).map(function (_0x46791f) {
      const _0x2e1d6a = JSON.parse("[\"" + utils.getFrom(_0x46791f, '', ']') + ']');
      _0x14c4ab.setCookie(utils.formatCookie(_0x2e1d6a, "facebook"), "https://www.facebook.com");
    });
    return utils.post("https://www.facebook.com/login/device-based/regular/login/?login_attempt=1&lwv=110", _0x14c4ab, _0x23c384, _0x12f712).then(utils.saveCookies(_0x14c4ab)).then(function (_0xc4bb42) {
      const _0x5afd32 = _0xc4bb42.headers;
      if (!_0x5afd32.location) {
        throw {
          'error': "Wrong username/password."
        };
      }
      if (_0x5afd32.location.indexOf("https://www.facebook.com/checkpoint/") > -1) {
        log.info("login", "You have login approvals turned on.");
        return utils.get(_0x5afd32.location, _0x14c4ab, null, _0x12f712).then(utils.saveCookies(_0x14c4ab)).then(function (_0x3006c5) {
          const _0x5a33d2 = _0x3006c5.body;
          const _0x48ce19 = cheerio.load(_0x5a33d2);
          let _0x43f3b4 = [];
          _0x48ce19("form input").map((_0x3f6443, _0x22db4c) => _0x43f3b4.push({
            'val': _0x48ce19(_0x22db4c).val(),
            'name': _0x48ce19(_0x22db4c).attr("name")
          }));
          _0x43f3b4 = _0x43f3b4.filter(function (_0x552be4) {
            return _0x552be4.val && _0x552be4.val.length;
          });
          const _0x53f9ba = utils.arrToForm(_0x43f3b4);
          if (_0x5a33d2.indexOf("checkpoint/?next") > -1) {
            setTimeout(() => {
              checkVerified = setInterval(_0x49a9b2 => {}, 5000, {
                'fb_dtsg': _0x53f9ba.fb_dtsg,
                'jazoest': _0x53f9ba.jazoest,
                'dpr': 0x1
              });
            }, 2500);
            throw {
              'error': "login-approval",
              'continue': function _0x4e5bbb(_0x3f3cb8) {
                _0x53f9ba.approvals_code = _0x3f3cb8;
                _0x53f9ba["submit[Continue]"] = _0x48ce19("#checkpointSubmitButton").html();
                let _0x1a7088 = null;
                let _0xe85703 = null;
                const _0x1f9033 = new Promise(function (_0x4eac2e, _0x4a73a1) {
                  _0x1a7088 = _0x4eac2e;
                  _0xe85703 = _0x4a73a1;
                });
                if (typeof _0x3f3cb8 == "string") {
                  utils.post("https://www.facebook.com/checkpoint/?next=https%3A%2F%2Fwww.facebook.com%2Fhome.php", _0x14c4ab, _0x53f9ba, _0x12f712).then(utils.saveCookies(_0x14c4ab)).then(function (_0x3b66e5) {
                    const _0x4b2394 = cheerio.load(_0x3b66e5.body);
                    const _0x765e1a = _0x4b2394("#approvals_code").parent().attr("data-xui-error");
                    if (_0x765e1a) {
                      throw {
                        'error': "login-approval",
                        'errordesc': "Invalid 2FA code.",
                        'lerror': _0x765e1a,
                        'continue': _0x4e5bbb
                      };
                    }
                  }).then(function () {
                    delete _0x53f9ba.no_fido;
                    delete _0x53f9ba.approvals_code;
                    _0x53f9ba.name_action_selected = "dont_save";
                    return utils.post("https://www.facebook.com/checkpoint/?next=https%3A%2F%2Fwww.facebook.com%2Fhome.php", _0x14c4ab, _0x53f9ba, _0x12f712).then(utils.saveCookies(_0x14c4ab));
                  }).then(function (_0x32ef5a) {
                    const _0x249422 = _0x32ef5a.headers;
                    if (!_0x249422.location && _0x32ef5a.body.indexOf("Review Recent Login") > -1) {
                      throw {
                        'error': "Something went wrong with login approvals."
                      };
                    }
                    const _0x5f1269 = utils.getAppState(_0x14c4ab);
                    if (_0x51505b === _0x370287) {
                      _0x51505b = function (_0x51b6c5, _0x48dad2) {
                        if (_0x51b6c5) {
                          return _0xe85703(_0x51b6c5);
                        }
                        return _0x1a7088(_0x48dad2);
                      };
                    }
                    return loginHelper(_0x5f1269, _0x3d4fc1, _0x173511, _0x12f712, _0x51505b);
                  })["catch"](function (_0x59233f) {
                    if (_0x51505b === _0x370287) {
                      _0xe85703(_0x59233f);
                    } else {
                      _0x51505b(_0x59233f);
                    }
                  });
                } else {
                  utils.post("https://www.facebook.com/checkpoint/?next=https%3A%2F%2Fwww.facebook.com%2Fhome.php", _0x14c4ab, _0x53f9ba, _0x12f712, null, {
                    'Referer': "https://www.facebook.com/checkpoint/?next"
                  }).then(utils.saveCookies(_0x14c4ab)).then(_0x54e12e => {
                    try {
                      JSON.parse(_0x54e12e.body.replace(/for\s*\(\s*;\s*;\s*\)\s*;\s*/, ''));
                    } catch (_0x6ac23e) {
                      clearInterval(checkVerified);
                      log.info("login", "Verified from browser. Logging in...");
                      if (_0x51505b === _0x370287) {
                        _0x51505b = function (_0x377d5c, _0x14c4ec) {
                          if (_0x377d5c) {
                            return _0xe85703(_0x377d5c);
                          }
                          return _0x1a7088(_0x14c4ec);
                        };
                      }
                      return loginHelper(utils.getAppState(_0x14c4ab), _0x3d4fc1, _0x173511, _0x12f712, _0x51505b);
                    }
                  })["catch"](_0x44101b => {
                    log.error("login", _0x44101b);
                    if (_0x51505b === _0x370287) {
                      _0xe85703(_0x44101b);
                    } else {
                      _0x51505b(_0x44101b);
                    }
                  });
                }
                return _0x1f9033;
              }
            };
          } else {
            if (!_0x12f712.forceLogin) {
              throw {
                'error': "Couldn't login. Facebook might have blocked this account. Please login with a browser or enable the option 'forceLogin' and try again."
              };
            }
            if (_0x5a33d2.indexOf("Suspicious Login Attempt") > -1) {
              _0x53f9ba["submit[This was me]"] = "This was me";
            } else {
              _0x53f9ba["submit[This Is Okay]"] = "This Is Okay";
            }
            return utils.post("https://www.facebook.com/checkpoint/?next=https%3A%2F%2Fwww.facebook.com%2Fhome.php", _0x14c4ab, _0x53f9ba, _0x12f712).then(utils.saveCookies(_0x14c4ab)).then(function () {
              _0x53f9ba.name_action_selected = "save_device";
              return utils.post("https://www.facebook.com/checkpoint/?next=https%3A%2F%2Fwww.facebook.com%2Fhome.php", _0x14c4ab, _0x53f9ba, _0x12f712).then(utils.saveCookies(_0x14c4ab));
            }).then(function (_0x43d2c5) {
              const _0x3e6b1a = _0x43d2c5.headers;
              if (!_0x3e6b1a.location && _0x43d2c5.body.indexOf("Review Recent Login") > -1) {
                throw {
                  'error': "Something went wrong with review recent login."
                };
              }
              const _0x31cb06 = utils.getAppState(_0x14c4ab);
              return loginHelper(_0x31cb06, _0x3d4fc1, _0x173511, _0x12f712, _0x51505b);
            })["catch"](_0x9bc00b => _0x51505b(_0x9bc00b));
          }
        });
      }
      return utils.get("https://www.facebook.com/", _0x14c4ab, null, _0x12f712).then(utils.saveCookies(_0x14c4ab));
    });
  };
}
function loginHelper(_0x3347f6, _0x3ddd01, _0x3ff83f, _0x2ac7fc, _0x1f5b22, _0x59c974) {
  let _0x33963e = null;
  const _0x2b26a3 = utils.getJar();
  if (_0x3347f6) {
    if (utils.getType(_0x3347f6) === "Array" && _0x3347f6.some(_0x63ef45 => _0x63ef45.name)) {
      _0x3347f6 = _0x3347f6.map(_0x6df74a => {
        _0x6df74a.key = _0x6df74a.name;
        delete _0x6df74a.name;
        return _0x6df74a;
      });
    } else {
      if (utils.getType(_0x3347f6) === "String") {
        const _0x563d23 = [];
        _0x3347f6.split(';').forEach(_0x5e45d6 => {
          const [_0x4fff46, _0x489c4d] = _0x5e45d6.split('=');
          _0x563d23.push({
            'key': (_0x4fff46 || '').trim(),
            'value': (_0x489c4d || '').trim(),
            'domain': "facebook.com",
            'path': '/',
            'expires': new Date().getTime() + 31536000000
          });
        });
        _0x3347f6 = _0x563d23;
      }
    }
    _0x3347f6.map(function (_0x23e895) {
      const _0x7e4786 = _0x23e895.key + '=' + _0x23e895.value + "; expires=" + _0x23e895.expires + "; domain=" + _0x23e895.domain + "; path=" + _0x23e895.path + ';';
      _0x2b26a3.setCookie(_0x7e4786, "http://" + _0x23e895.domain);
    });
    _0x33963e = utils.get("https://www.facebook.com/", _0x2b26a3, null, _0x2ac7fc, {
      'noRef': true
    }).then(utils.saveCookies(_0x2b26a3));
  } else {
    _0x33963e = utils.get("https://www.facebook.com/", null, null, _0x2ac7fc, {
      'noRef': true
    }).then(utils.saveCookies(_0x2b26a3)).then(makeLogin(_0x2b26a3, _0x3ddd01, _0x3ff83f, _0x2ac7fc, _0x1f5b22, _0x59c974)).then(function () {
      return utils.get("https://www.facebook.com/", _0x2b26a3, null, _0x2ac7fc).then(utils.saveCookies(_0x2b26a3));
    });
  }
  let _0x533acb = [1, "https://m.facebook.com/"];
  let _0x18a7c2;
  let _0xe85d1a;
  function _0x2bb31b(_0x215cea) {
    const _0x5b6b47 = /This browser is not supported/gs;
    if (_0x5b6b47.test(_0x215cea.body)) {
      const _0x26972e = JSON.stringify(_0x215cea.body);
      const _0x4af719 = _0x26972e.split("2Fhome.php&amp;gfid=")[1];
      if (_0x4af719 == undefined) {
        return _0x215cea;
      }
      const _0x2f5c44 = _0x4af719.split("\\\\")[0];
      if (_0x4af719 == undefined || _0x4af719 == '') {
        return _0x215cea;
      }
      const _0x4460f3 = _0x2f5c44.split("\\")[0];
      if (_0x4460f3 == undefined || _0x4460f3 == '') {
        return _0x215cea;
      }
      const _0x4822f6 = _0x533acb[1] + "a/preferences.php?basic_site_devices=m_basic&uri=" + encodeURIComponent("https://m.facebook.com/home.php") + "&gfid=" + _0x4460f3;
      return utils.get(_0x4822f6, _0x2b26a3, null, _0x2ac7fc).then(utils.saveCookies(_0x2b26a3));
    } else {
      return _0x215cea;
    }
  }
  function _0x54da5c(_0x45356b) {
    const _0xb07cc8 = /<meta http-equiv="refresh" content="0;url=([^"]+)[^>]+>/;
    _0x533acb = _0xb07cc8.exec(_0x45356b.body);
    if (_0x533acb && _0x533acb[1]) {
      return utils.get(_0x533acb[1], _0x2b26a3, null, _0x2ac7fc).then(utils.saveCookies(_0x2b26a3));
    }
    return _0x45356b;
  }
  _0x33963e = _0x33963e.then(_0x1ebf50 => _0x54da5c(_0x1ebf50)).then(_0x146cdc => _0x2bb31b(_0x146cdc)).then(function (_0x27395a) {
    const _0x5ef299 = /MPageLoadClientMetrics/gs;
    if (!_0x5ef299.test(_0x27395a.body)) {
      _0x2ac7fc.userAgent = "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1";
      return utils.get("https://www.facebook.com/", _0x2b26a3, null, _0x2ac7fc, {
        'noRef': true
      }).then(utils.saveCookies(_0x2b26a3));
    } else {
      return _0x27395a;
    }
  }).then(_0x3108c9 => _0x54da5c(_0x3108c9)).then(_0x51e1bc => _0x2bb31b(_0x51e1bc)).then(function (_0x3a8026) {
    const _0x28bbd1 = _0x3a8026.body;
    const _0x53b526 = buildAPI(_0x2ac7fc, _0x28bbd1, _0x2b26a3);
    _0x18a7c2 = _0x53b526[0];
    _0xe85d1a = _0x53b526[2];
    return _0x3a8026;
  });
  if (_0x2ac7fc.pageID) {
    _0x33963e = _0x33963e.then(function () {
      return utils.get("https://www.facebook.com/" + _0x18a7c2.globalOptions.pageID + "/messages/?section=messages&subsection=inbox", _0x18a7c2.jar, null, _0x2ac7fc);
    }).then(function (_0x4be696) {
      let _0x4560f8 = utils.getFrom(_0x4be696.body, "window.location.replace(\"https:\\/\\/www.facebook.com\\", "\");").split("\\").join('');
      _0x4560f8 = _0x4560f8.substring(0, _0x4560f8.length - 1);
      return utils.get("https://www.facebook.com" + _0x4560f8, _0x18a7c2.jar, null, _0x2ac7fc);
    });
  }
  _0x33963e.then(function () {
    log.info("login", "Done logging in.");
    return _0x1f5b22(null, _0xe85d1a);
  })["catch"](function (_0xdd87f4) {
    log.error("login", _0xdd87f4.error || _0xdd87f4);
    _0x1f5b22(_0xdd87f4);
  });
}
function login(_0x4a5cd1, _0x34ccf2, _0x201059) {
  if (utils.getType(_0x34ccf2) === "Function" || utils.getType(_0x34ccf2) === "AsyncFunction") {
    _0x201059 = _0x34ccf2;
    _0x34ccf2 = {};
  }
  const _0x3cfedd = {
    'selfListen': false,
    'selfListenEvent': false,
    'listenEvents': false,
    'listenTyping': false,
    'updatePresence': false,
    'forceLogin': false,
    'autoMarkDelivery': true,
    'autoMarkRead': false,
    'autoReconnect': true,
    'logRecordSize': 100,
    'online': false,
    'emitReady': false,
    'userAgent': "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_2) AppleWebKit/600.3.18 (KHTML, like Gecko) Version/8.0.3 Safari/600.3.18"
  };
  setOptions(_0x3cfedd, _0x34ccf2);
  let _0x574aee = null;
  let _0x4c9691;
  if (utils.getType(_0x201059) !== "Function" && utils.getType(_0x201059) !== "AsyncFunction") {
    let _0x5e928f = null;
    let _0x5b6700 = null;
    _0x4c9691 = new Promise(function (_0x28d794, _0x32c9e5) {
      _0x5b6700 = _0x28d794;
      _0x5e928f = _0x32c9e5;
    });
    _0x574aee = function (_0x133b17, _0x144238) {
      if (_0x133b17) {
        return _0x5e928f(_0x133b17);
      }
      return _0x5b6700(_0x144238);
    };
    _0x201059 = _0x574aee;
  }
  loginHelper(_0x4a5cd1.appState, _0x4a5cd1.email, _0x4a5cd1.password, _0x3cfedd, _0x201059, _0x574aee);
  return _0x4c9691;
}
module.exports = login;
