'use strict';

var debug = require('debug')('dmn-provider');

var ensureOpts = require('util/ensure-opts');

var isUnsaved = require('util/file/is-unsaved');

var tableXML = require('./table.dmn'),
    diagramXML = require('./diagram.dmn');

var DmnTab = require('./dmn-tab');

var ids = require('ids')([ 32, 36, 1 ]);

/**
 * Add ability to create and open DMN tables.
 *
 * @param {Object} options
 */
function DmnProvider(options) {

  ensureOpts([ 'app' ], options);

  var app = options.app;

  var createdFiles = 0;

  this.createNewFile = function(attrs) {

    attrs = attrs || {};

    var xml;

    // increment counter
    createdFiles++;

    debug('create DMN file');

    // make ID ROBUST
    xml = (
      (attrs.isTable ? tableXML : diagramXML)
        .replace('{{ ID }}', ids.next())
    );

    return {
      fileType: 'dmn',
      name: 'diagram_' + createdFiles + '.dmn',
      path: isUnsaved.PATH,
      contents: xml
    };
  };

  this.canCreate = function(fileType) {
    return fileType === 'dmn';
  };

  this.createTab = function(file) {

    // TODO(vlad): get rid of app all together for tab provider
    return app.createComponent(DmnTab, {
      file: file,
      closable: true,
      id: ids.next()
    });
  };
}

module.exports = DmnProvider;
