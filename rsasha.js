/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is trusted.js; substantial portions derived
 * from XAuth code originally produced by Meebo, Inc., and provided
 * under the Apache License, Version 2.0; see http://github.com/xauth/xauth
 *
 * Contributor(s):
 *     Ben Adida <benadida@mozilla.com>
 *     Michael Hanson <mhanson@mozilla.com>
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

function RSASHAAlgorithm(hash, keyPEM) {
  if (hash == "sha1") {
    this.hash = "sha1";
  } else if (hash == "sha256") {
    this.hash = "sha256";
  } else {
    throw new NoSuchAlgorithmException("JWT algorithm: " + hash);  
  }

  this.keyPEM = keyPEM;
}

RSASHAAlgorithm.prototype = {
  update: function _update(data) {
    this.data = data;
  },

  finalize: function _finalize() {
  },
  
  sign: function _sign() {
    var rsa = new libs.RSAKey();
    rsa.readPrivateKeyFromPEMString(this.keyPEM);
    var hSig = rsa.signString(this.data, this.hash);
    return hex2b64urlencode(hSig);
  },

  verify: function _verify(sig) {
    var rsa = new libs.RSAKey();
    rsa.readPublicKeyFromPEMString(this.keyPEM);
    var result = rsa.verifyString(this.data, b64urltohex(sig));
    return result;
  }
};

exports.RSASHAAlgorithm = RSASHAAlgorithm;